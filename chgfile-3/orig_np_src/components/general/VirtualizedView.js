import React from 'react'
import { FlatList } from 'react-native'

const VirtualizedView = props => {
  return (
    <FlatList
      style={props.style}
      data={[]}
      bounces={props.bounces}
      {...props}
      ListEmptyComponent={null}
      showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
      keyExtractor={() => 'index'}
      renderItem={null}
      ListHeaderComponent={<React.Fragment>{props.children}</React.Fragment>}
    />
  )
}
export { VirtualizedView }
