import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-orders';

import Order from '../../components/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

class Orders extends Component {
    componentDidMount() {
        this.props.onFetchOrders(this.props.token);
    }

    render() {
        return (
            <div>
                {this.props.loading ? <Spinner />
                : this.props.orders.map(order => (
                    <Order 
                        key={order.id}
                        ingredients={order.ingredients}
                        price={+order.price}
                    />
                ))}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    orders: state.orderReducer.orders,
    loading: state.orderReducer.loading,
    token: state.authReducer.token
});

const mapDispatchToProps = dispatch => ({
    onFetchOrders: token => dispatch(actions.fetchOrders(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));