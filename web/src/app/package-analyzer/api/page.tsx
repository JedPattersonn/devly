export default function Component() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">API Documentation</h1>
        <h2 className="text-2xl font-bold mb-4">/api/dependency-analyzer</h2>
        <h3 className="text-xl font-bold mb-4">POST Request Body</h3>
        <div className="bg-muted p-4 rounded-md mb-6">
          <pre className="text-sm">{`{
    "dependencies": {
      "react": "17.0.2",
      "react-dom": "17.0.2",
      "next": "12.1.6",
      "axios": "0.26.1"
    }
  }`}</pre>
        </div>
        <p className="mb-4">
          The <code>dependencies</code> field should be an object where the keys
          are the package names and the values are the versions.
        </p>
        <h3 className="text-xl font-bold mb-4">Example Response</h3>
        <div className="bg-muted p-4 rounded-md mb-6">
          <pre className="text-sm">{`{
    "outdatedDependencies": [
      {
        "name": "react",
        "currentVersion": "17.0.2",
        "latestVersion": "18.2.0",
        "needsUpdate": true
      },
      {
        "name": "axios",
        "currentVersion": "0.26.1",
        "latestVersion": "0.27.2",
        "needsUpdate": true
      }
    ]
  }`}</pre>
        </div>
        <p className="mb-4">
          The <code>outdatedDependencies</code> array will list any dependencies
          that need to be updated, including the package name, current version,
          latest version, and a flag indicating that an update is needed.
        </p>
      </div>
    </div>
  );
}
