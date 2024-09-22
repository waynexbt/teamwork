import * as chartActions from "./chartActions";
const InitialState = {
    currentPrice: 1,
    time: 30,
    isActive: false
}

const chartReducer = (state = InitialState, action) => {
    switch (action.type) {
        case chartActions.CURRENT_PRICE:
            return {
                ...state,
                currentPrice: action.payload,
            }
        case chartActions.SET_TIME:
            console.log(action.payload, 'hang pain')
            return {
                ...state,
                time: action.payload,
            }
        case chartActions.SET_ISACTIVE:
            return {
                ...state,
                isActive: action.payload,
            }
        default:
            return state
    }

}

export default chartReducer;