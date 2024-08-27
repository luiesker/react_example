import './App.css'
import { Provider, ErrorBoundary, LEVEL_WARN } from '@rollbar/react' // <-- Provider imports 'rollbar' for us

// same configuration you would create for the Rollbar.js SDK
const rollbarConfig = {
  accessToken: 'yourtokenhere',
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: 'production',
  server: {
    root: "http://example.com/",
    branch: "main"
  },
  code_version: "0.13.7",
  payload: {
    person: {
      id: 117,
      email: "chief@abc.com",
      username: "john-doe"
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
  function FallbackUI({error, resetErrorBoundary}) {
    console.log("Fallback")
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