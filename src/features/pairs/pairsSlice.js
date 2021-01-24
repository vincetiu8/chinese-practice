import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";

const pairsAdapter = createEntityAdapter({
	sortComparer: (a, b) => {
		const diff = a.rank - b.rank
		return Math.min(Math.max(diff, -1), 1)
	}
})

const initialState = pairsAdapter.getInitialState({
	loadStatus: 'unloaded',
	editingPair: null,
	solvingPair: null,
	pastSolvingPairs: [],
	status: 'loading'
})

const pairsSlice = createSlice({
	name: 'pairs',
	initialState,
	reducers: {
		fetchPairs(state, action) {
			const json = localStorage.getItem('pairs')
			const storedPairs = JSON.parse(json)
			pairsAdapter.upsertMany(state, storedPairs)
			state.loadStatus = 'loaded'
			state.status = 'idle'
		},
		deletePairs(state, action) {
			pairsAdapter.removeAll(state)
		},
		deletePair(state, action) {
			pairsAdapter.removeOne(state, action.payload)
		},
		deletePracticeInfo(state, action) {
			pairsAdapter.updateMany(state, state.entities.map(pair => {
				return {
					...pair,
					rank: 0,
					seen: false,
					lastLearned: Date()
				}
			}))
		},
		addPairs: {
			reducer: (state, action) => {
				pairsAdapter.upsertMany(state, action.payload)
			},
			prepare: (rawPairs) => {
				const pairs = rawPairs.map((pair) => {
					return {
						...pair,
						rank: 0,
						seen: false,
						lastLearned: Date()
					}
				})
				return {payload: pairs}
			}
		},
		savePairs(state, action) {
			const json = JSON.stringify(state.entities)
			console.log(json)
			localStorage.setItem('pairs', json)
		},
		editPair(state, action) {
			const {newId, definition} = action.payload
			const existingPair = state.entities[state.editingPair.id]
			if (existingPair) {
				existingPair.id = newId
				existingPair.definition = definition
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
				if (state.pastSolvingPairs.length > Math.min(Object.keys(state.entities).length - 1, 2)) // todo: change later to be configurable
					state.pastSolvingPairs.shift()
			}
			state.status = 'solving'
			for (let id of state.ids) {
				if (!state.pastSolvingPairs.includes(id.toString())) {
					state.solvingPair = state.entities[id]
					if (!state.solvingPair.seen) {
						state.solvingPair.rank = -3 // todo: change later
						state.solvingPair.seen = true
						pairsAdapter.updateOne(state, state.solvingPair)
					}
					return
				}
			}
		},
		submitAnswer(state, action) {
			if (action.payload === state.solvingPair.definition) {
				if (state.status !== 'wrong') {
					pairsAdapter.updateOne(state, {
						id: state.solvingPair.id,
						changes: {
							rank: state.solvingPair.rank + 1
						}
					})
				}

				pairsSlice.caseReducers.updateSolvingPair(state, action)
			} else {
				pairsAdapter.updateOne(state, {
					id: state.solvingPair.id,
					changes: {
						rank: state.solvingPair.rank - 1
					}
				})
				state.status = 'wrong'
			}
		}
	}
})

export const {
	fetchPairs,
	deletePairs,
	addPairs,
	savePairs,
	editPair,
	updateEditingPair,
	deletePair,
	updateSolvingPair,
	submitAnswer
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