import AppRouter  from "./router/AppRouter";
import QueryProvider from "./providers/QueryProvider";
import AuthBootstrapper from "./providers/AuthBootstrapper";

const App = () => {
  return (
    <QueryProvider>
      <AuthBootstrapper />
      <AppRouter />;
    </QueryProvider>
    )
}

export default App