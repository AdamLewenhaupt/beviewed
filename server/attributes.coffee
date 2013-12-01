module.exports =
	sessionsExpire:
		type: Date
		expires: "0.5h"

	usersFirstName:
		type: String
		lowercase: true
		trim: true

	usersLastName:
		type: String
		lowercase: true
		trim: true

	usersEmail:
		type: String
		lowercase: true
		trim: true

	communitiesName:
		type: String
		lowercase: true
		trim: true