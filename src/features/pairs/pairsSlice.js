import {createAsyncThunk, createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
let unorm = require("unorm")

const pairsAdapter = createEntityAdapter({
	sortComparer: (a, b) => {
		const diff = a.rank - b.rank
		const fixedDiff = Math.min(Math.max(diff, -1), 1)
		return (fixedDiff !== 0 || a.rank !== 0) ? fixedDiff : a.nonce - b.nonce
	}
})

const initialState = pairsAdapter.getInitialState({
	loadStatus: 'unloaded',
	editingPair: null,
	solvingPair: null,
	pastSolvingPairs: [],
	status: 'loading',
	settings: {
		lostPointsOnFail: 1,
		gainedPointsOnSuccess: 1,
		startingPoints: -3,
		minimumGapBetweenElements: 5,
		dailyGoal: 25,
		dayInterval: 3,
		flipTerms: true,
		askTerm: false,
		learnedOnlyMode: false,
	},
	stats: {
		totalTerms: 0,
		seenTerms: 0,
		learnedTerms: 0,
		history: {},

	},
	currentDate: null,
	historyStats: {
		learnedTerms: {
			currentSession: 0,
			today: 0,
			week: 0,
			month: 0
		},
		goalMet: {
			today: false,
			week: false,
			month: false
		}
	}
})

const serverURL = "http://" + window.location.hostname + ":5000/"

export const addPairs = createAsyncThunk(
	'pairs/addPairs',
	async content => {
		let pairsToTranslate = []
		let pairs = []

		const rawLines = content.split("\n")
		const rawPairs = rawLines.map(rawLine =>
			rawLine.indexOf(' ') !== -1
				? [
					rawLine.substr(0, rawLine.indexOf(' ')),
					rawLine.substr(rawLine.indexOf(' ') + 1)
				] : [rawLine]
		)

		for (let pair of rawPairs) {
			if (pair.length === 0)
				continue
			if (pair.length === 1) {
				pairsToTranslate.push(pair[0])
			} else {
				pairs.push({
					id: unorm.nfd(pair[0]).trim(),
					definition: pair[1]
				})
			}
		}

		if (pairsToTranslate.length > 0) {
			for (let i = 0; i < pairsToTranslate.length; i += 128) { // separated into 128 term chunks
				console.log(serverURL)
				const result = await axios.post(serverURL, { // hardcoded to avoid confusion
					terms: pairsToTranslate.slice(i, Math.min(i + 128, pairsToTranslate.length))
				})

				for (let j = 0; j < result.data.length; j++) {
					pairs.push({
						id: unorm.nfd(pairsToTranslate[i + j]).trim(),
						definition: result.data[j].translatedText.toLowerCase()
					})
				}
			}
		}

		return pairs
	}
)

const pairsSlice = createSlice({
	name: 'pairs',
	initialState,
	reducers: {
		addDataFromFile(state, action) {
			pairsAdapter.upsertMany(state, action.payload)
			let seenTerms = 0, learnedTerms = 0 // recalculate stats
			for (let id of state.ids) {
				const term = state.entities[id]
				if (term.seen) {
					seenTerms += 1
					if (term.rank > 0) {
						learnedTerms += 1
					}
				}
			}
			state.stats = {
				totalTerms: state.ids.length,
				seenTerms: seenTerms,
				learnedTerms: learnedTerms
			}
		},
		setGoalMet(state, action) {
			state.historyStats.goalMet = {
				today: state.settings.dailyGoal !== 0 &&
				state.historyStats.learnedTerms.today >= state.settings.dailyGoal,
					week: state.settings.dailyGoal !== 0 &&
				state.historyStats.learnedTerms.week >= state.settings.dailyGoal * 7,
					month: state.settings.dailyGoal !== 0 &&
				state.historyStats.learnedTerms.month >= state.settings.dailyGoal * 30
			}
		},
		fetchInfo(state, action) {
			let json = localStorage.getItem('chinese-practice/pairs')
			if (json !== null) {
				const storedPairs = JSON.parse(json)
				pairsAdapter.upsertMany(state, storedPairs)
			}

			json = localStorage.getItem('chinese-practice/history')
			let history = {}
			if (json !== null) {
				history = JSON.parse(json)
			}

			json = localStorage.getItem('chinese-practice/settings')
			if (json !== null) {
				state.settings = JSON.parse(json)
			}

			let seenTerms = 0, learnedTerms = 0 // recalculate stats on reload
			const now = new Date()
			const exactDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
			state.currentDate = exactDate.getTime()
			for (let id of state.ids) {
				const term = state.entities[id]
				if (term.seen > 1) {
					seenTerms += 1
					if (term.lastSeen <= state.currentDate - 86400000 * state.settings.dayInterval ** (term.seen - 2)) {
						pairsAdapter.updateOne(state, {
							...term,
							rank: 0
						})
					} else if (term.rank > 0) {
						learnedTerms += 1
					}
				}
				const trimmed = term.id.trim()
				if (trimmed !== id) {
					pairsAdapter.removeOne(state, term)
					term.id = trimmed
					pairsAdapter.addOne(state, term)
				}
			}
			state.stats = {
				totalTerms: state.ids.length,
				seenTerms: seenTerms,
				learnedTerms: learnedTerms,
				history: history
			}

			let learnedTermsDay = 0, learnedTermsWeek = 0, learnedTermsMonth = 0
			const currentMonth = new Date(state.currentDate - 2592000000) // unix value of 1 month
			const currentWeek = new Date(state.currentDate - 604800000) // unix value of 1 week
			const monthHistory = Object.keys(state.stats.history).filter(key => key > currentMonth)
			if (monthHistory.length > 0) {
				for (const day of monthHistory) {
					const dayData = state.stats.history[day]
					learnedTermsMonth += dayData
					if (day > currentWeek)
						learnedTermsWeek += dayData
					if (parseInt(day) === state.currentDate)
						learnedTermsDay = dayData
				}
			}

			state.historyStats = {
				learnedTerms: {
					...state.historyStats.learnedTerms,
					today: learnedTermsDay,
					week: learnedTermsWeek,
					month: learnedTermsMonth
				}
			}

			pairsSlice.caseReducers.setGoalMet(state, action)
			state.loadStatus = 'loaded'
			state.status = 'idle'
		},
		deletePairs(state, action) {
			pairsAdapter.removeAll(state)
			state.stats = {
				totalTerms: 0,
				seenTerms: 0,
				learnedTerms: 0
			}
			state.historyStats = {
				learnedTerms: {
					currentSession: 0,
					today: 0,
					week: 0,
					month: 0
				},
				goalMet: {
					today: false,
					week: false,
					month: false
				}
			}
		},
		deletePair(state, action) {
			state.stats = {
				...state.stats,
				totalTerms: state.stats.totalTerms - 1,
				seenTerms: state.entities[action.payload].seen ? state.stats.seenTerms - 1 : state.stats.seenTerms,
				learnedTerms: state.entities[action.payload].rank > 0 ? state.stats.learnedTerms - 1 : state.stats.learnedTerms
			}
			if (state.entities[action.payload].rank > 0) {
				state.historyStats = {
					learnedTerms: {
						currentSession: state.historyStats.learnedTerms.currentSession - 1,
						today: state.historyStats.learnedTerms.today - 1,
						week: state.historyStats.learnedTerms.week - 1,
						month: state.historyStats.learnedTerms.month - 1
					}
				}
			}
			pairsSlice.caseReducers.setGoalMet(state, action)
			pairsAdapter.removeOne(state, action.payload)
			pairsSlice.caseReducers.updateSolvingPair(state, action)
			state.status = 'idle'
		},
		deletePracticeInfo(state, action) {
			const updatedPairs = Object.values(state.ids).map(id => {
				const pair = state.entities[id]
				pair.rank = 0
				pair.seen = 0
				pair.lastSeen = -1
				pair.flip = state.settings.askTerm
				pair.nonce = Math.random() - 0.5
				return pair
			})
			state.stats = {
				...state.stats,
				seenTerms: 0,
				learnedTerms: 0
			}
			state.historyStats = {
				learnedTerms: {
					currentSession: 0,
					today: 0,
					week: 0,
					month: 0
				},
				goalMet: {
					today: false,
					week: false,
					month: false
				}
			}
			pairsAdapter.updateMany(state, updatedPairs)
			pairsSlice.caseReducers.updateSolvingPair(state, action)
		},
		saveInfo(state, action) {
			let json = JSON.stringify(state.entities)
			localStorage.setItem('chinese-practice/pairs', json)
			json = JSON.stringify(state.settings)
			localStorage.setItem('chinese-practice/settings', json)
			state.stats.history[state.currentDate] = state.historyStats.learnedTerms.today
			json = JSON.stringify(state.stats.history)
			localStorage.setItem('chinese-practice/history', json)
		},
		editPair(state, action) {
			const {newId, definition} = action.payload
			const existingPair = state.entities[state.editingPair.id]
			if (existingPair) {
				pairsAdapter.removeOne(state, state.editingPair.id)
				pairsAdapter.upsertOne(state, {
					id: newId,
					definition: definition,
					rank: 0,
					seen: -1,
					flip: state.settings.askTerm,
					nonce: Math.random() - 0.5
				})
			}
			state.editingPair = null
			state.solvingPair = null
			state.stats.totalTerms = state.ids.length
			state.status = 'idle'
		},
		updateEditingPair(state, action) {
			state.editingPair = state.entities[action.payload]
			state.status = 'editing'
		},
		updateSolvingPair(state, action) {
			if (state.solvingPair !== null) {
				state.pastSolvingPairs.push(state.solvingPair.id.toString())
				const maxLen = state.settings.learnedOnlyMode ? state.stats.learnedTerms : state.stats.totalTerms
				if (state.pastSolvingPairs.length >
					Math.min(
						maxLen - 1,
						state.settings.minimumGapBetweenElements
					)
				)
					state.pastSolvingPairs.shift()
			}
			state.status = 'solving'
			for (let id of state.ids) {
				if (state.pastSolvingPairs.includes(id.toString())) {
					continue
				}

				state.solvingPair = state.entities[id]
				if (state.settings.learnedOnlyMode &&
					(state.solvingPair.seen === 0 || state.solvingPair.rank <= 0))
					continue

				if (state.solvingPair.seen === 0) {
					state.solvingPair.rank = state.settings.startingPoints
					state.stats = {
						...state.stats,
						seenTerms: state.stats.seenTerms + 1
					}
					state.solvingPair.seen = 1
				}

				state.solvingPair.lastSeen = state.currentDate
				pairsAdapter.updateOne(state, state.solvingPair)

				return
			}

			// code runs when user hasn't learned any terms and is on learnedOnlyMode
			state.status = 'invalidLearningMode'
		},
		submitAnswer(state, action) {
			if (action.payload.toLowerCase() === (state.solvingPair.flip
				? state.solvingPair.id.toLowerCase()
				: state.solvingPair.definition.toLowerCase())) {
				if (state.status !== 'wrong') {
					const newRank = state.solvingPair.rank + state.settings.gainedPointsOnSuccess
					const learned = state.solvingPair.rank <= 0 && newRank > 0
					pairsAdapter.updateOne(state, {
						id: state.solvingPair.id,
						changes: {
							rank: newRank,
							seen: learned ? state.solvingPair.seen + 1 : state.solvingPair.seen,
							flip: state.settings.flipTerms ? !state.solvingPair.flip : state.settings.askTerm
						}
					})
					if (learned) {
						state.stats = {
							...state.stats,
							learnedTerms: state.stats.learnedTerms + 1
						}
						state.historyStats = {
							...state.historyStats,
							learnedTerms: {
								currentSession: state.historyStats.learnedTerms.currentSession + 1,
								today: state.historyStats.learnedTerms.today + 1,
								week: state.historyStats.learnedTerms.week + 1,
								month: state.historyStats.learnedTerms.month + 1,
							}
						}
						if (state.settings.dailyGoal !== 0) {
							if (!state.historyStats.goalMet.today)
								state.historyStats.goalMet.today =
									state.historyStats.learnedTerms.today >= state.settings.dailyGoal
							if (!state.historyStats.goalMet.week)
								state.historyStats.goalMet.week =
									state.historyStats.learnedTerms.week >= state.settings.dailyGoal * 7
							if (!state.historyStats.goalMet.month)
								state.historyStats.goalMet.month =
									state.historyStats.learnedTerms.month >= state.settings.dailyGoal * 30
						}
					}
				}

				pairsSlice.caseReducers.updateSolvingPair(state, action)
			} else {
				const newRank = state.solvingPair.rank - state.settings.lostPointsOnFail
				pairsAdapter.updateOne(state, {
					id: state.solvingPair.id,
					changes: {
						rank: newRank,
						seen: 1
					}
				})
				if (state.solvingPair.rank > 0 && newRank <= 0) {
					state.stats = {
						...state.stats,
						learnedTerms: state.stats.learnedTerms - 1
					}
					state.historyStats = {
						...state.historyStats,
						learnedTerms: {
							currentSession: state.historyStats.learnedTerms.currentSession - 1,
							today: state.historyStats.learnedTerms.today - 1,
							week: state.historyStats.learnedTerms.week - 1,
							month: state.historyStats.learnedTerms.month - 1,
						}
					}
				}
				state.status = 'wrong'
			}
		},
		updateSettings(state, action) {
			Object.assign(state.settings, action.payload)
			state.status = 'idle'
			if (Object.keys(action.payload)[0] === "learnedOnlyMode")
				state.pastSolvingPairs = []
		}
	},
	extraReducers: {
		[addPairs.pending]: (state, action) => {
			state.status = "loading"
		},
		[addPairs.fulfilled]: (state, action) => {
			state.status = "idle"
			for (const pair of action.payload) {
				if (state.ids.includes(pair.id)) {
					state.entities[pair.id].definition = pair.definition
				} else {
					pairsAdapter.upsertOne(state, {
						...pair,
						rank: 0,
						seen: 0,
						lastSeen: -1,
						flip: state.settings.askTerm,
						nonce: Math.random() - 0.5
					})
				}
			}
			state.stats.totalTerms = state.ids.length
			pairsSlice.caseReducers.saveInfo(state, action)
		},
		[addPairs.rejected]: (state, action) => {
			state.status = "failed"
			state.error = action.error
		}
	}
})

export const {
	fetchInfo,
	saveInfo,
	deletePairs,
	editPair,
	updateEditingPair,
	deletePair,
	updateSolvingPair,
	submitAnswer,
	updateSettings,
	deletePracticeInfo,
	addDataFromFile,
} = pairsSlice.actions

export default pairsSlice.reducer

export const {
	selectAll: selectAllPairs,
	selectById: selectPairById,
	selectIds: selectPairIds
} = pairsAdapter.getSelectors(state => state.pairs)

export const selectPairsBySearchTerm = createSelector(
	[selectAllPairs, (state, searchTerm) => searchTerm],
	(pairs, searchTerm) => {
		if (searchTerm === '') {
			return pairs
		}

		return pairs.filter(pair =>
			pair.id.indexOf(searchTerm) !== -1 || pair.definition.indexOf(searchTerm) !== -1
		)
	}
)