// import React from 'react';
// import { StatusBar } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import Navigation from './resources/navigations'; 
// import Toast from 'react-native-toast-message';

// const App: React.FC = () => {
//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle="dark-content" backgroundColor="white" />
//       <Navigation />
//       <Toast />
//     </SafeAreaProvider>
//   );
// };

// export default App;



import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './resources/navigations';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Navigation />
      <Toast />
    </SafeAreaProvider>
  );
};

export default App;