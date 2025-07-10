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
      <h1 class="text-5xl font-bold whitespace-nowrap dark:text-white">Github Profile Finder</h1>
      <div class="w-xl h-xl sm:w-2xl sm:h-2xl my-10">
        <form onSubmit={(e) => {e.preventDefault(); GithubProfileAPI()}} class="flex items-center w-xl h-xl sm:w-2xl sm:h-2xl mx-auto font-medium">   
            <label for="simple-search" class="sr-only">Search</label>
            <div class="relative w-full shadow-lg">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500" placeholder="Search username..." required />
            </div>
            <button type="submit" class="shadow-lg p-2.5 ms-2 text-sm font-medium bg-indigo-500 dark:text-white rounded-lg border border-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 text-white">
                Search
                <span class="sr-only">Search</span>
            </button>
        </form>

        {error && (<p class="text-red-600 dark:text-red-400 text-center flex flex-col shadow-lg justify-center my-4 p-10 bg-gray-100/75 dark:bg-gray-600/75 rounded-md">{error}</p>)}

        {profile && (
          <div class="flex flex-col shadow-lg justify-center sm:justify-center items-center sm:items-center my-4 p-7 sm:p-6 bg-gray-100/75 dark:bg-gray-600/75 rounded-md dark:text-white">
            <div class="flex flex-row space-x-12 sm:space-x-10 items-center sm:items-center">
              <img src ={profile.avatar_url} class="w-32 h-32 rounded-full sm:w-36 sm:h-36"></img>
              <div class="flex flex-col text-left space-y-4">
                <div class="flex flex-col">
                  <p className="text-3xl sm:text-4xl font-bold">
                    {profile.name || profile.login}
                  </p>
                  <p class=" text-sm">{profile.bio}</p>
                </div>
                <div class="flex flex-row space-x-14 text-center text-sm">
                  <div class="flex flex-col">
                    <h3 class="font-extrabold">{profile.followers}</h3>
                    <p>Followers</p>
                  </div>
                  <div class="flex flex-col">
                    <h3 class="font-bold">{profile.following}</h3>
                    <p>Following</p>
                  </div>
                  <div class="flex flex-col">
                    <h3 class="font-bold">{profile.public_repos}</h3>
                    <p>Repositories</p>
                  </div>
                </div>
              </div>
            </div> 
          </div>
        )}

        {repos.length > 0 && (
          <div className="my-8 dark:text-white ">
            <h2 className="text-xl font-semibold mb-4 text-center">Repositories</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-center">
              {repos.map((repo) => (
                <li
                  key={repo.id}
                  className="p-4 bg-gray-100/75 dark:bg-gray-600/75 rounded-lg shadow hover:shadow-md transition text-left hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-indigo-200 font-semibold text-sm leading-none"
                  >
                    <div className="font-semibold hover:underline text-sm leading-tight">
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
