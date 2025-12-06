import StreetViewImages from "./components/StreetViewImages";
import RoutePlanner from "./components/RoutePlanner";

function App() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Roadtrip Demo</h1>
      <StreetViewImages />
      <RoutePlanner/>
    </div>
  );
}

export default App;

