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

			json = localStorage.getItem('chinese-practice/settings')
			if (json !== null) {
				state.settings = JSON.parse(json)
			}
			state.loadStatus = 'loaded'
			state.status = 'idle'
		},
		deletePairs(state, action) {
			pairsAdapter.removeAll(state)
		},
		deletePair(state, action) {
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
			pairsAdapter.updateMany(state, updatedPairs)
			pairsSlice.caseReducers.updateSolvingPair(state, action)
		},
		saveInfo(state, action) {
			let json = JSON.stringify(state.entities)
			localStorage.setItem('chinese-practice/pairs', json)
			json = JSON.stringify(state.settings)
			localStorage.setItem('chinese-practice/settings', json)
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
					pairsAdapter.updateOne(state, {
						id: state.solvingPair.id,
						changes: {
							rank: state.solvingPair.rank + state.settings.gainedPointsOnSuccess,
							flip: state.settings.flipTerms ? !state.solvingPair.flip : state.settings.askTerm
						}
					})
				}

				pairsSlice.caseReducers.updateSolvingPair(state, action)
			} else {
				pairsAdapter.updateOne(state, {
					id: state.solvingPair.id,
					changes: {
						rank: state.solvingPair.rank - state.settings.lostPointsOnFail
					}
				})
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