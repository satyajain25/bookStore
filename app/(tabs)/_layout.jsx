// import { Tabs } from "expo-router";

// export default function HomeLayout() {
//   return (
//     <Tabs initialRouteName="index" screenOptions={{ headerShown: false }}>
//       <Tabs.Screen name="index"  options={{ title: "Home" }}/>
//       <Tabs.Screen name="addBook" />
//       <Tabs.Screen name="profile" />
//     </Tabs>
//   );
// }
import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function HomeLayout() {
  return (
    <Tabs 
      initialRouteName="index" 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#9CA3AF', 
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen 
        name="addBook" 
        options={{ 
          title: "Add Book",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "add-circle" : "add-circle-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}