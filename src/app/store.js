import {configureStore} from '@reduxjs/toolkit'
import pairsReducer from '../features/pairs/pairsSlice'

export default configureStore({
	reducer : {
		pairs: pairsReducer
	}
})