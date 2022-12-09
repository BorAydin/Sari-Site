import { useState } from "react"
import {toast} from 'react-toastify'
import { Link, useNavigate } from "react-router-dom"
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg"
import visibilityIcon from "../assets/svg/visibilityIcon.svg"
import OAuth from "../components/OAuth"


function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { email, password } = formData

  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()

      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      if(userCredential.user) {
        navigate('/')
      }
    } catch (error) {
      toast.error('Yanlış Kullanıcı Bilgileri')
    }
  }
 
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Hoş geldiniz</p>
        </header>

        <form onSubmit={onSubmit}>
          <input 
            type="email"
            className="emailInput"
            placeholder="E-posta"
            id="email"
            value={email}
            onChange={onChange} 
          />

          <div className="passwordInputDiv">
            <input 
              type={showPassword ? 'text' : 'password'} 
              className="passwordInput" 
              placeholder="Parola"
              id="password"
              value={password}
              onChange={onChange} 
            />

            <img 
              src={visibilityIcon} 
              alt="Parola Göster"
              className="showPassword"
              onClick={() => setShowPassword((prevState) => !prevState)} 
            />
          </div>

          <Link to ="/forgot-password" className="forgotPasswordLink">Şifremi Unuttum</Link>

          <div className="signInBar">
            <p className="signInText">Giriş</p> 
            <button className="signInButton">
              <ArrowRightIcon fill="#fff" width='34px' height='34px' />
            </button>
          </div>
        </form>

        <OAuth/>

        <Link to="/sign-up" className="registerLink">
          Kaydol
        </Link>
      </div>
    </>
  )
}

export default SignIn