import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)
  const [repos, setRepos] = useState([])

  const GithubProfileAPI = async () => {
    try {
      const userfetch = `https://api.github.com/users/${username}`;
      const userresponse = await fetch(userfetch);
      if(!userresponse.ok) {
        if(userresponse.status===404) {
          setError("User not found");
        } else {
          setError(`Error: ${userresponse.status}`);
        }
        setProfile(null);
        setRepos([]);
        return;
      }
      
      const userdata = await userresponse.json();
      setProfile(userdata);

      const repofetch = `https://api.github.com/users/${username}/repos`;
      const reporesponse = await fetch(repofetch);
      const repodata = await reporesponse.json();
      setRepos(repodata);

      setError(null);
    } catch (e) {
      setError(e.message);
      setProfile(null);
      setRepos([]);
    }
  }

  return (
    <>
      <h1 className="text-3xl md:text-5xl font-bold dark:text-white text-center whitespace-nowrap">Github Profile Finder</h1>
      <div className="w-lg h-full my-10">
        <form onSubmit={(e) => {e.preventDefault(); GithubProfileAPI()}} className="flex flex-row w-full h-full items-center mx-auto font-medium gap-2">   
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full shadow-lg">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="Search username..." required />
            </div>
            <button type="submit" className="shadow-lg p-2.5 text-sm font-medium bg-indigo-500 dark:text-white rounded-lg border border-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 text-white w-auto">
                Search
                <span className="sr-only">Search</span>
            </button>
        </form>

        {error && (<p className="text-red-600 dark:text-red-400 text-center flex flex-col shadow-lg justify-center my-4 p-6 bg-gray-100/75 dark:bg-gray-600/75 rounded-md">{error}</p>)}

        {profile && (
          <div className="flex flex-col shadow-lg justify-center items-center my-4 p-6 sm:p-6 bg-gray-100/75 dark:bg-gray-600/75 rounded-md dark:text-white">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-5 items-center justify-center w-full">
              <div className="w-32 h-32 flex-shrink-0">
                <img src={profile.avatar_url} className="w-full h-full rounded-full object-cover" alt={profile.login} />
              </div>
            
              <div className="flex flex-col text-center sm:text-left space-y-4 w-full sm:max-w-md">
                <div className="flex flex-col">
                  <div className="overflow-hidden">
                    <p className="text-2xl sm:text-3xl font-bold break-words whitespace-normal">
                      {profile.name || profile.login}
                    </p>
                  </div>
                  
                  <div className="overflow-y-auto">
                    <p className="text-sm">{profile.bio || "No bio available"}</p>
                  </div>
                </div>

                <div className="flex flex-row justify-center sm:justify-start space-x-6 sm:space-x-14 text-center text-xs sm:text-sm">
                  <div className="flex flex-col">
                    <h3 className="font-extrabold">{profile.followers}</h3>
                    <p>Followers</p>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold">{profile.following}</h3>
                    <p>Following</p>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold">{profile.public_repos}</h3>
                    <p>Repositories</p>
                  </div>
                </div>
              </div>
            </div> 
          </div>
        )}

        {repos.length > 0 && (
          <div className="my-6 md:my-8 dark:text-white">
            <h2 className="text-xl font-semibold mb-4 text-center">Repositories</h2>
            <ul className="grid grid-cols-3 gap-4">
              {repos.map((repo) => (
                <li
                  key={repo.id}
                  className="w-40 h-full p-3 text-left md:p-4 bg-gray-100/75 dark:bg-gray-600/75 rounded-lg shadow hover:shadow-md transition hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col h-full text-gray-600 dark:text-indigo-200"
                >
                  <div className="font-semibold hover:underline text-sm truncate">
                    {repo.name}
                  </div>
                  <div className="text-sm mt-2 text-gray-500 flex gap-4 text-xs">
                    <span>⭐ {repo.stargazers_count}</span>
                    <span>🍴 {repo.forks_count}</span>
                  </div>
                </a>

                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

export default App
