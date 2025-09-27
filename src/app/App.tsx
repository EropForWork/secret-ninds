import { Cards } from '@/pages/Cards';
import { Login } from '@/pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/cards" element={<Cards />} />
			</Routes>
		</Router>
	);
}

export default App;
