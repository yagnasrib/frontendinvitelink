import type React from "react"

interface PollProps {
  pollData: {
    pollId: string
    question: string
    options: string[]
    votes: number[]
    voters: string[]
  }
  userId: string
  onVote: (pollId: string, optionIndex: number) => void
}

const Poll: React.FC<PollProps> = ({ pollData, userId, onVote }) => {
  const totalVotes = pollData.votes.reduce((sum, count) => sum + count, 0)
  const hasVoted = pollData.voters.includes(userId)

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-md w-full">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">{pollData.question}</h3>
      <div className="space-y-2">
        {pollData.options.map((option, index) => {
          const voteCount = pollData.votes[index]
          const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0
          const isSelected =
            hasVoted &&
            pollData.voters[pollData.voters.length - 1] === userId &&
            pollData.votes.indexOf(Math.max(...pollData.votes)) === index

          return (
            <div key={index} className="relative">
              <button
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  hasVoted
                    ? isSelected
                      ? "bg-blue-100 dark:bg-blue-800"
                      : "bg-gray-100 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                } border ${isSelected ? "border-blue-400" : "border-transparent"}`}
                onClick={() => !hasVoted && onVote(pollData.pollId, index)}
                disabled={hasVoted}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{option}</span>
                  {hasVoted && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {voteCount} vote{voteCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                {hasVoted && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          isSelected ? "bg-blue-500" : "bg-gray-400 dark:bg-gray-500"
                        } transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{percentage.toFixed(0)}%</span>
                  </div>
                )}
              </button>
            </div>
          )
        })}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
        {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
      </p>
    </div>
  )
}

export default Poll

