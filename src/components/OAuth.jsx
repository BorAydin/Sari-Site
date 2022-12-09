import {useLocation, useNavigate} from 'react-router-dom'
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import {doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {
  const navigate = useNavigate()
  const location = useLocation()

  const onGoogleClick = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result =  await signInWithPopup(auth, provider)
      const user = result.user
      
      // Kullanıcı kontrolü
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      // Kullanıcı yoksa oluşturma
      if(!docSnap.exists()){
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp()
        })
      }
      navigate('/')
    } catch (error) {
      toast.error('Google ile giriş sağlanamadı.')
    }
  }

  return (
    <div className='socialLogin'>
      <button className='socialIconDiv' onClick={onGoogleClick}>
        <img className='socialIconImg' src={googleIcon} alt="google" />
      </button>
      <p>{location.pathname === '/sign-up' ? 'İle Kaydol' : 'İle Giriş Yap'}</p>
    </div>
  )
}

export default OAuth