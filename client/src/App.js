import React from 'react'
//import state and useEffect hooks
import { useState, useEffect } from 'react';

export default function App() {
    //define state for records
    const [listings, setListings] = useState(null);

    //useEffect hook to fetch records
    useEffect(() => {
        fetch('/api/v1/listings')
            .then(res => res.json())
            .then(listings => setListings(listings));
    }, []);
          
  return (
    <div>
        <h1>Listings</h1>
        {listings && listings.map(listing => (
            <div key={listing._id}>
                <h2>{listing._id}</h2>
            </div>
        ))}
    </div>
  )
}