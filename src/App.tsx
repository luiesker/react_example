import './App.css'
import { Provider, ErrorBoundary, LEVEL_WARN } from '@rollbar/react' // <-- Provider imports 'rollbar' for us

// same configuration you would create for the Rollbar.js SDK
const rollbarConfig = {
  accessToken: 'yourtokenhere',
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: 'production',
  payload: {
    person: {
      id: 117,
      email: "chief@abc.com",
      username: "john-doe"
    },
    server: {
      root: "../../",
      branch: "main"
    },
    client: {
      javascript: {
        code_version: 'main',
        source_map_enabled: true,
        guess_uncaught_frames: true
      }
    }
  },
  // Code here to determine whether or not to send the payload
  // to the Rollbar API
  // return true to ignore the payload
  checkIgnore: function(isUncaught, args, payload) {
    if (payload && payload.body && payload.body.trace && 
      payload.body.trace.exception && payload.body.trace.exception.message && 
      payload.body.trace.exception.message.match(/ignored/)) {
        return true
    }
    return false
  }
}

function refreshPage(){ window.parent.location = window.parent.location.href; }

function App() {
  var FallbackUI = function({error}) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={refreshPage}>
          Reset
        </button>
      </div>
    )
  }
  
  const MyComponent = () => {
    var pick = Math.floor(Math.random()*10)
    if (pick > 5) {
      throw new Error('Something went wrong!')
    } else {
      throw new Error('Error, but this is ignored!')
    }
  }

  return (
    <Provider config={rollbarConfig} >
      <ErrorBoundary level={LEVEL_WARN} fallbackUI={FallbackUI}>
        <MyComponent></MyComponent>
      </ErrorBoundary>
    </Provider>
  )
}

export default App