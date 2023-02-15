import React from 'react'

import {
    Switch,
    Route
} from "react-router-dom";

import Home from '../pages/Home'
import Login from '../pages/Login'

export default function Routes() {
    return (
        <div>
            <Switch>

                <Route path="/home">
                    <Home />
                </Route>
                <Route exact path="/">
                    <Login />
                </Route>
            </Switch>
        </div>
    )
}
