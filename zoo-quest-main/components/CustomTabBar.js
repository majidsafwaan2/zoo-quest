import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.container, 
      { paddingBottom: insets.bottom ? insets.bottom : 10 }
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        
        const isFocused = state.index === index;
        
        const icon = options.tabBarIcon ? 
          options.tabBarIcon({ 
            color: isFocused ? '#2f6b47' : '#999', 
            size: 22 
          }) : null;
        
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tab}
          >
            {icon}
            <Text style={[
              styles.label,
              { color: isFocused ? '#2f6b47' : '#999' }
            ]}>
              {label}
            </Text>
            {isFocused && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    height: 60,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 3,
    backgroundColor: '#2f6b47',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
}); 