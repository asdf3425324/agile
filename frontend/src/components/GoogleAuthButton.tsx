import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { useNavigate } from "react-router"
import styled from 'styled-components'

async function auth(userInfo) {
  return await axios.post('/auth', {
    name: userInfo.given_name,
    email: userInfo.email
  })
}

const GoogleButton = styled.div`
  width: 100%;
  margin: 2rem;
`
const Text = styled.div`
  margin: 0 auto;
  width: 200px;
  cursor: pointer;
`

const GoogleAuthButton = () => {
  const navigate = useNavigate()
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse: any) => {
    // fetching userinfo can be done on the client or the server
      const userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then(res => res.data)

      const res = await auth(userInfo)

      if (res.data.message === 'ok') {
        localStorage.setItem('token', res.data.user.token)
        await navigate("/dashboard")
      }
    },
  })
  return (
    <div>
      <div>
        <GoogleButton  onClick={() => login()}>
          <Text>Зайти через гугл </Text>
        </GoogleButton>
      </div>
    </div>
  )
}

export default GoogleAuthButton