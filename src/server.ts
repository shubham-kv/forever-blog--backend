import app from './app'

;(async function bootstrap() {
	const port = 5000

	app.listen(port, () => {
		console.log(`Server running at http://localhost:${port}`)
	})
})()
