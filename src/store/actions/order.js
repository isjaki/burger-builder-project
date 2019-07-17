import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerStart = () => ({
    type: actionTypes.PURCHASE_BURGER_START
});

export const purchaseBurgerSuccess = (orderId, orderData) => ({
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId,
    orderData
});

export const purchaseBurgerFail = error => ({
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error
});

export const purchaseBurger = (orderData, token) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        axios.post(`/orders.json?auth=${token}`, orderData)
            .then(response => {
                dispatch(purchaseBurgerSuccess(response.data.name, orderData));
            })
            .catch(error => {
                dispatch(purchaseBurgerFail(error));
            });
    }
};

export const initPurchase = () => ({
    type: actionTypes.PURCHASE_INIT
});

export const fetchOrdersSuccess = orders => ({
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders
});

export const fetchOrdersFail = error => ({
    type: actionTypes.FETCH_ORDERS_FAIL,
    error
});

export const fetchOrdersStart = () => ({
    type: actionTypes.FETCH_ORDERS_START
});

export const fetchOrders = token => {
    return dispatch => {
        dispatch(fetchOrdersStart());
        
        axios.get(`/orders.json?auth=${token}`)
            .then(res => {
                const fetchedOrders = [];

                for (let key in res.data) {
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key
                    });
                }

                dispatch(fetchOrdersSuccess(fetchedOrders));
            })
            .catch(error => {
                dispatch(fetchOrdersFail(error));
            });
    }
}