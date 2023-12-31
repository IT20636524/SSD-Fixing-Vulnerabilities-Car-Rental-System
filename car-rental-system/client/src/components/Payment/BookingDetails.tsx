import BookingCard from './BookingCard';
import axios from '../../lib/axios';;
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function BookingDetails() {

    const params = useParams();
    const [posts, setPosts] =useState<any>([]);
    useEffect(()=> {
        axios.get(`/bookings/${params.booking_id}`)
        .then(res => {
            console.log(res.data)
            setPosts(res.data)
        })
        .catch(err =>{
            console.log(err)
        })
    }, [])

    return (
        <div>


            <Link to = {`/view-cards/${posts.booking_id}`}><button type="button" className="btn btn-warning" style={{ width: "200px", height: "50px", float: "right" }}>
                see Your Cards
            </button></Link>


            <br /><br /><br />

            <BookingCard />

          
        </div>
    )
}
