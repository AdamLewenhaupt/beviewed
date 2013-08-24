capitalize = (word) -> 
	if word
		word[0].toUpperCase() + word[1..-1]

limit = (word, n) ->
	if word.length > n
		word.substr(0, n) + "..."
	else
		word