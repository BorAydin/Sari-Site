import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, limit, startAfter,} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Category() {
  const [listings, setListings] = useState(null) 
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  const params = useParams()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(db, 'listings')

        // Creata a query
        const q = query(
          listingsRef, 
          where('type', '==', params.categoryName ),
          orderBy('timestamp', 'desc'),
          limit(10)
          )

          // Execute query
          const querySnap = await getDocs(q)

          const lastVisible = querySnap.docs[querySnap.docs.length-1]
          setLastFetchedListing(lastVisible)

          const listings = []

          querySnap.forEach((doc) => {
            return listings.push({
              id: doc.id,
              data: doc.data(),
            })
          })

          setListings(listings)
          setLoading(false)
      } catch (error) {
        toast.error('Veri gelemedi.')
      }
    }

    fetchListings()
  },[params.categoryName])

  // Pagination / Load More
  const onFetchMoreListings = async () => {
    try {
      // Get reference
      const listingsRef = collection(db, 'listings')

      // Creata a query
      const q = query(
        listingsRef, 
        where('type', '==', params.categoryName ),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10)
        )

        // Execute query
        const querySnap = await getDocs(q)

        const lastVisible = querySnap.docs[querySnap.docs.length-1]
        setLastFetchedListing(lastVisible)

        const listings = []

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })

        setListings((prevState) => [...prevState, ...listings])
        setLoading(false)
    } catch (error) {
      toast.error('Veri gelemedi.')
    }
  }

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>
          {params.categoryName === 'rent' ? 'Kiral??k yerler' : 'Sat??l??k yerler'}
        </p>
      </header>
      
      {loading ? (<Spinner/>) : listings && listings.length > 0 ? ( 
      <>
        <main>
          <ul className='categoryListings'>
            {listings.map((listing) => (
              <ListingItem 
                listing={listing.data}
                id={listing.id}
                key={listing.id}
              />
            ))}
          </ul>
        </main>

        <br />
        <br />
        {lastFetchedListing && (
          <p className="loadMore" onClick={onFetchMoreListings}>Daha Fazla Y??kle</p>
        )}
      </>) : (<p>{params.categoryName === 'rent' ? 'Kiral??k yerler yoktur.' : 'Sat??l??k yerler yoktur.'}</p>)}
    </div>
  )
}

export default Category