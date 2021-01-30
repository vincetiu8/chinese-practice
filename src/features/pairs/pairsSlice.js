import {createAsyncThunk, createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

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
		flipTerms: true,
		askTerm: false,
	},
	stats: {
		totalTerms: 0,
		seenTerms: 0,
		learnedTerms: 0,
	}
})

export const addPairs = createAsyncThunk(
	'pairs/addPairs',
	async rawPairs => {
		let pairsToTranslate = []
		let pairs = []

		for (let pair of rawPairs) {
			if (pair[0] === "")
				continue
			if (pair.length === 1) {
				pairsToTranslate.push(pair[0])
			} else {
				pairs.push({
					id: pair[0],
					definition: pair[1]
				})
			}
		}

		if (pairsToTranslate.length > 0) {
			for (let i = 0; i < pairsToTranslate.length; i += 128) { // separated into 128 term chunks
				const result = await axios.post('http://127.0.0.1:5000/', { // port hardcoded to avoid confusion
					terms: pairsToTranslate.slice(i, Math.min(i + 128, pairsToTranslate.length))
				})

				for (let j = 0; j < result.data.length; j++) {
					pairs.push({
						id: pairsToTranslate[i + j],
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
		fetchInfo(state, action) {
			let json = localStorage.getItem('chinese-practice/pairs')
			if (json !== null) {
				const storedPairs = JSON.parse(json)
				pairsAdapter.upsertMany(state, storedPairs)
			}

			let seenTerms = 0, learnedTerms = 0 // recalculate stats on reload
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

			json = localStorage.getItem('chinese-practice/settings')
			if (json !== null) {
				state.settings = JSON.parse(json)
			}
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
		},
		deletePair(state, action) {
			state.stats = {
				totalTerms: state.state.totalTerms - 1,
				seenTerms: state.entities[action.payload].seen ? state.state.seenTerms - 1 : state.seenTerms,
				learnedTerms: state.entities[action.payload].rank > 0 ? state.state.learnedTerms - 1 : state.learnedTerms
			}
			pairsAdapter.removeOne(state, action.payload)
			state.status = 'idle'
		},
		deletePracticeInfo(state, action) {
			const updatedPairs = Object.values(state.ids).map(id => {
				const pair = state.entities[id]
				pair.rank = 0
				pair.seen = false
				pair.flip = state.settings.askTerm
				pair.nonce = Math.random() - 0.5
				return pair
			})
			state.stats = {
				...state.stats,
				seenTerms: 0,
				learnedTerms: 0
			}
			pairsAdapter.updateMany(state, updatedPairs)
			pairsSlice.caseReducers.updateSolvingPair(state, action)
		},
		saveInfo(state, action) {
			let json = JSON.stringify(state.entities)
			localStorage.setItem('chinese-practice/pairs', json)
			json = JSON.stringify(state.settings)
			localStorage.setItem('chinese-practice/settings', json)
			json = JSON.stringify(state.stats)
			localStorage.setItem('chinese-practice/stats', json)
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
					seen: false,
					flip: state.settings.askTerm,
					nonce: Math.random() - 0.5
				})
			}
			state.editingPair = null
			state.solvingPair = null
			state.status = 'idle'
		},
		updateEditingPair(state, action) {
			state.editingPair = state.entities[action.payload]
			state.status = 'editing'
		},
		updateSolvingPair(state, action) {
			if (state.solvingPair !== null) {
				state.pastSolvingPairs.push(state.solvingPair.id.toString())
				if (state.pastSolvingPairs.length >
					Math.min(
						Object.keys(state.entities).length - 1,
						state.settings.minimumGapBetweenElements
					)
				)
					state.pastSolvingPairs.shift()
			}
			state.status = 'solving'
			for (let id of state.ids) {
				if (!state.pastSolvingPairs.includes(id.toString())) {
					state.solvingPair = state.entities[id]
					if (!state.solvingPair.seen) {
						state.solvingPair.rank = state.settings.startingPoints
						state.solvingPair.seen = true
						state.stats = {
							...state.stats,
							seenTerms: state.stats.seenTerms + 1
						}
						pairsAdapter.updateOne(state, state.solvingPair)
					}
					return
				}
			}
		},
		submitAnswer(state, action) {
			if (action.payload.toLowerCase() === (state.solvingPair.flip
				? state.solvingPair.id.toLowerCase()
				: state.solvingPair.definition.toLowerCase())) {
				if (state.status !== 'wrong') {
					const newRank = state.solvingPair.rank + state.settings.gainedPointsOnSuccess
					pairsAdapter.updateOne(state, {
						id: state.solvingPair.id,
						changes: {
							rank: newRank,
							flip: state.settings.flipTerms ? !state.solvingPair.flip : state.settings.askTerm
						}
					})
					if (state.solvingPair.rank <= 0 && newRank > 0) {
						state.stats = {
							...state.stats,
							learnedTerms: state.stats.learnedTerms + 1
						}
					}
				}

				pairsSlice.caseReducers.updateSolvingPair(state, action)
			} else {
				const newRank = state.solvingPair.rank - state.settings.lostPointsOnFail
				pairsAdapter.updateOne(state, {
					id: state.solvingPair.id,
					changes: {
						rank: newRank
					}
				})
				if (state.solvingPair.rank > 0 && newRank <= 0) {
					state.stats = {
						...state.stats,
						learnedTerms: state.stats.learnedTerms - 1
					}
				}
				state.status = 'wrong'
			}
		},
		updateSettings(state, action) {
			Object.assign(state.settings, action.payload)
		}
	},
	extraReducers: {
		[addPairs.pending]: (state, action) => {
			state.status = "loading"
		},
		[addPairs.fulfilled]: (state, action) => {
			state.status = "idle"
			const pairs = action.payload.map(pair => {
				return {
					...pair,
					rank: 0,
					seen: false,
					flip: state.settings.askTerm,
					nonce: Math.random() - 0.5
				}
			})
			pairsAdapter.upsertMany(state, pairs)
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
	deletePracticeInfo
} = pairsSlice.actions

export default pairsSlice.reducer

export const {
	selectAll: selectAllPairs, // todo: limit number of pairs returned
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