export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-gaming">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="font-gaming text-6xl font-bold mb-4">
            <span className="gaming-gradient bg-clip-text text-transparent">
              Daniel's Quest Hub
            </span>
          </h1>
          <p className="text-text-secondary text-xl mb-8 max-w-2xl mx-auto">
            Level up your daily missions with the ultimate family task tracker. 
            Complete quests, earn XP, and become the productivity champion!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-gradient-cyan text-gaming-bg font-gaming font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary-400/25 active:scale-95">
              🎮 Start Your Quest
            </button>
            <button className="border border-primary-400 text-primary-400 bg-transparent hover:bg-primary-400 hover:text-gaming-bg hover:shadow-lg hover:shadow-primary-400/25 active:scale-95 font-gaming font-semibold py-3 px-6 rounded-lg transition-all duration-300">
              📊 View Progress
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="gaming-card hover:scale-105 transition-transform animate-glow border-primary-400/50 shadow-lg shadow-primary-400/20">
            <div className="w-12 h-12 bg-gradient-cyan rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-gaming text-lg font-semibold mb-2">Epic Quests</h3>
            <p className="text-text-secondary mb-4">
              Transform boring tasks into exciting gaming missions with XP rewards
            </p>
            <ul className="space-y-2 text-text-secondary">
              <li>• Daily missions with XP rewards</li>
              <li>• Priority-based difficulty levels</li>
              <li>• Achievement system</li>
            </ul>
          </div>

          <div className="gaming-card hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="font-gaming text-lg font-semibold mb-2">Family Alliance</h3>
            <p className="text-text-secondary mb-4">
              Parents and Daniel working together in the ultimate productivity guild
            </p>
            <ul className="space-y-2 text-text-secondary">
              <li>• Multi-user task assignment</li>
              <li>• Family progress tracking</li>
              <li>• Collaborative achievements</li>
            </ul>
          </div>

          <div className="gaming-card hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="font-gaming text-lg font-semibold mb-2">Smart Sync</h3>
            <p className="text-text-secondary mb-4">
              Seamless Google Calendar integration for ultimate organization
            </p>
            <ul className="space-y-2 text-text-secondary">
              <li>• Calendar synchronization</li>
              <li>• Recurring task automation</li>
              <li>• Smart reminders</li>
            </ul>
          </div>
        </div>

        {/* Gaming Stats Demo */}
        <div className="bg-gaming-card border border-gaming-border rounded-xl p-8 mb-16">
          <h2 className="font-gaming text-3xl font-bold mb-8 text-center">
            <span className="neon-text">Player Stats Preview</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400 mb-2">1,247</div>
              <div className="text-text-secondary">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">89</div>
              <div className="text-text-secondary">Quests Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">12</div>
              <div className="text-text-secondary">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-400 mb-2">7</div>
              <div className="text-text-secondary">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="font-gaming text-2xl font-bold mb-4">Ready to Level Up?</h3>
          <p className="text-text-secondary mb-6">
            Join the quest and turn your daily tasks into an epic adventure!
          </p>
          <button className="bg-gradient-accent text-white hover:shadow-lg hover:shadow-accent-400/25 hover:animate-glow active:scale-95 font-gaming font-semibold py-4 px-10 text-lg rounded-xl transition-all duration-300 animate-pulse">
            🚀 Launch Quest Hub
          </button>
        </div>
      </div>
    </div>
  )
}
