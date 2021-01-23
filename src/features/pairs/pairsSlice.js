import {createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";

const pairsAdapter = createEntityAdapter({
	sortComparer: (a, b) => b.term > a.term
})

const initialState = pairsAdapter.getInitialState({
	loadStatus: 'unloaded',
	currentPair: null,
	status: 'loading',
})

const pairsSlice = createSlice({
	name: 'pairs',
	initialState,
	reducers: {
		fetchPairs(state, action) {
			const json = localStorage.getItem('pairs')
			const storedPairs = JSON.parse(json)
			pairsAdapter.upsertMany(state, storedPairs)
			state.loadStatus = 'succeeded'
			state.status = 'idle'
		},
		deletePairs(state, action) {
			pairsAdapter.removeAll(state)
		},
		deletePair(state, action) {
			pairsAdapter.removeOne(state, action.payload)
		},
		addPairs(state, action) {
			pairsAdapter.upsertMany(state, action.payload)
		},
		savePairs(state, action) {
			const json = JSON.stringify(state.entities)
			console.log(json)
			localStorage.setItem('pairs', json)
		},
		editPair(state, action) {
			const {oldId, newId, definition} = action.payload
			const existingPair = state.entities[oldId]
			if (existingPair) {
				existingPair.id = newId
				existingPair.definition = definition
			}
			state.currentPair = null
			state.status = 'idle'
		},
		updateCurrentPair(state, action) {
			const {id, status} = action.payload
			state.currentPair = state.entities[id]
			state.status = status
		},
		submitAnswer(state, action) {
			state.status = state.currentPair.definition === action.payload
				? 'idle'
				: 'wrong'
		}
	}
})

export const {
	fetchPairs,
	deletePairs,
	addPairs,
	savePairs,
	editPair,
	updateCurrentPair,
	submitAnswer,
	deletePair
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