import {
  useNavigate,
} from "react-router-dom"
import { useEffect } from "react"
import GoogleAuthButton from '../components/GoogleAuthButton'
import styled from "styled-components"


const Header = styled.div`
  font-size: 50px;
  line-height: 42px;
  margin: 2rem;
  text-align: center;
`;

const Home = () => {
  const navigate = useNavigate()
  const click = async () => {
    await navigate("/login")
  }
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard')
    }
  }, [])
  return (
    <div>
      <Header>Канбан доска.</Header>
      <GoogleAuthButton />
    </div>
  )
}

export default Home