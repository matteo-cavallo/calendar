import {
    FlatList,
    ListRenderItem,
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    NativeSyntheticEvent, NativeScrollEvent
} from 'react-native';
import {useEffect, useState} from 'react';
import {startOfWeek, eachDayOfInterval, addDays, format, isSameDay, subDays} from 'date-fns';

export default function App() {

    const date = new Date()

    const currentStartOfWeekDate = startOfWeek(date, {weekStartsOn: 1})

    const getNextWeekByStartingDate = (startingDate: Date) => {
        return eachDayOfInterval({
            start: startingDate,
            end: addDays(startingDate, 7)
        })
    }

    const [weeks, setWeeks] = useState([
        getNextWeekByStartingDate(subDays(currentStartOfWeekDate, 8)),
        getNextWeekByStartingDate(currentStartOfWeekDate),
        getNextWeekByStartingDate(addDays(currentStartOfWeekDate, 8)),
    ])
    const [lastStartOfWeekDate, setLastStartOfWeekDate] = useState(currentStartOfWeekDate)

    const RenderWeek = (value: Date[], index: number) => {


        const date = new Date()
        return (
            <View key={index} style={styles.weekContainer}>
                {value.map((day, index) => {
                    return (
                        <View key={index} style={{alignItems: 'center'}}>
                            <Text>{format(day, 'MMM')}</Text>
                            <Text>{format(day, 'dd')}</Text>
                        </View>
                    )
                })}
            </View>
        )
    }

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        console.log(event.nativeEvent)
        const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent

        // Check if we are at the end of the scroll view
        if (contentOffset.x + layoutMeasurement.width >= contentSize.width) {
            setWeeks([...weeks, getNextWeekByStartingDate(addDays(lastStartOfWeekDate, 8))])
            setLastStartOfWeekDate(addDays(lastStartOfWeekDate, 8))
        }

        // Check if we are at the start of the scroll view
        if (contentOffset.x <= 0) {
            // setWeeks([getNextWeekByStartingDate(subDays(lastStartOfWeekDate, 8)), ...weeks])
            // setLastStartOfWeekDate(subDays(lastStartOfWeekDate, 8))
            // console.log('scrolled to the start')
        }
    }

    return (
        <SafeAreaView>
            <ScrollView horizontal pagingEnabled {...{onScroll}} scrollEventThrottle={16}
                        showsHorizontalScrollIndicator={false}>
                {weeks.map(RenderWeek)}
            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        padding: 16
    },
    weekContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width,
        padding: 16
    }
})
