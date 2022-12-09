import {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Navigation, Pagination, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {getDoc, doc} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {db} from '../firebase.config'
import Spinner  from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'

function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists()) {
        setListing(docSnap.data())
        setLoading(false)
      }
    }

    fetchListing()
  }, [navigate, params.listingId])

  if(loading){
    return <Spinner />
  }
 
  return (
    <main>
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        slidesPerView={1}
        style={{
         width:'100%', height:'300px',
        }}
        pagination={{ clickable: true }}
      >
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
          <div
            style={{
              background: `url(${listing.imageUrls[index]})`
            }}
            className='swiperSlideDiv'
         ></div>
         </SwiperSlide>
        ))}
      </Swiper>
      
      
      <div className='shareIconDiv' onClick={() => {
        navigator.clipboard.writeText(window.location.href)
        setShareLinkCopied(true)
        setTimeout(() => {
          setShareLinkCopied(false)
        }, 2000)
      }}>
        <img src={shareIcon} alt="" />
      </div>

      {shareLinkCopied && <p className='linkCopied'>Bağlantı Kopyalandı.</p>}

      <div className='listingDetails'>
        <p className='listingName'>
          {listing.name} | {" "}  
          {listing.offer 
            ? listing.discountedPrice
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
            : listing.regularPrice
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₺
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          {listing.type = 'rent' ? 'Kiralık' : 'Satılık'}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            {listing.regularPrice - listing.discountedPrice}₺ İndirim
          </p>
        )}

        <ul className="listingDetailsList">
          <li>
             {listing.bedrooms > 1
              ? `${listing.bedrooms} Oda`
              : '1 Oda'}
          </li>
          <li>
             {listing.bathrooms > 1
              ? `${listing.bathrooms} Banyo`
              : '1 Banyo'}
          </li>
          <li>{listing.parking && 'Otopark vardır.'}</li>
          <li>{listing.furnished && 'Eşyalıdır.'}</li>

          <p className="listingLocationTitle">Konum</p>

          { <div className="leafletContainer">
            <MapContainer style={{height: '100%', width:'100%'}} center={[listing.latitude, listing.longitude]} zoom={13} scrollWheelZoom={false}>
              <TileLayer url='https://tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
              <Marker position={[listing.latitude, listing.longitude]}>
                <Popup>{listing.location}</Popup>
              </Marker>
            </MapContainer>
          </div> }

          {auth.currentUser?.uid !== listing.userRef && (
            <Link to = {`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>
              İlan Sahibiyle İletişime Geçin
            </Link>
          )}
        </ul>
      </div>
    </main>
  )
}


export default Listing