


  const handleThrottleSearch = () => {

    if (throttling.current) {

      return

    }

    // If there is no search term, do not make API call

    if (!inputRef.current.value.trim()) {

      setAnimals([])

      return

    }

    throttling.current = true

    setTimeout(() => {

      throttling.current = false

      fetch(`http://localhost:4000/animals?q=${inputRef.current.value}`)

        .then(async response => {

          if (!response.ok) {

            console.log("Something went wrong!")

          } else {

            const data = await response.json()

            setAnimals(data)

          }

        })

        .catch(err => {

          console.error(err)

        })

    }, 600)

  }