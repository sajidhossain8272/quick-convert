export default function Loader() {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div
        className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"
        style={{ animationDuration: "0.6s" }}
      ></div>
      <div
        className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"
        style={{ animationDuration: "0.6s", animationDelay: "0.15s" }}
      ></div>
      <div
        className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"
        style={{ animationDuration: "0.6s", animationDelay: "0.3s" }}
      ></div>
    </div>
  );
}
