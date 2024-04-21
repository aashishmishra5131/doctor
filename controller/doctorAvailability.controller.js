import fs from 'fs';

const availabilityJson = fs.readFileSync('Availability.json');
const availability = JSON.parse(availabilityJson);

const checkDoctorAvailability = (req, res) => {
    const { date, time } = req.query;
    const currentDate = new Date().toISOString().split('T')[0];
    if (date < currentDate) {
        return res.status(200).json({
            isAvailable: false,
            message: "Please provide a future date."
        });
    }
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    // console.log(dayOfWeek);
    if(dayOfWeek==='sunday'){
        let tomorrow = new Date(date);
        let aaa=tomorrow.setDate(tomorrow.getDate() + 1);
        return res.status(200).json({
            isAvailable: false,
            nextAvailableSlot: {
                date: new Date(aaa),
                time: availability.availabilityTimings['monday'][0].start
            }
        });
    }
    const slots = availability.availabilityTimings[dayOfWeek];
    const userTime = new Date(`${date}T${time}`).getTime();

    for (const slot of slots) {
        const startTime = new Date(`${date}T${slot.start}`).getTime();
        const endTime = new Date(`${date}T${slot.end}`).getTime();

        if (userTime >= startTime && userTime <= endTime) {
            return res.status(200).json({ isAvailable: true });
        } else if (userTime < startTime) {
            return res.status(200).json({
                isAvailable: false,
                nextAvailableSlot: {
                    date: date,
                    time: slot.start
                }
            });
        }
    }
    if (dayOfWeek === 'saturday') {
        return res.status(200).json({
            isAvailable: false,
            nextAvailableSlot: {
                date: getNextAvailableDate(date, 'monday'),
                time: availability.availabilityTimings['monday'][0].start
            }
        });
    }
    const nextDayOfWeek = getNextDayOfWeek(dayOfWeek);
    return res.status(200).json({
        isAvailable: false,
        nextAvailableSlot: {
            date: getNextAvailableDate(date, nextDayOfWeek),
            time: availability.availabilityTimings[nextDayOfWeek][0].start
        }
    });
};
function getNextDayOfWeek(dayOfWeek) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const index = days.indexOf(dayOfWeek);
    return index === days.length - 1 ? days[0] : days[index + 1];
}

function getNextAvailableDate(date, nextDayOfWeek) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDate = new Date(date);
    console.log("current",currentDate);
    const currentDayOfWeek = currentDate.getDay();
    const targetDayOfWeek = days.indexOf(nextDayOfWeek);
    let daysToAdd = targetDayOfWeek - currentDayOfWeek;
    if (daysToAdd <0) {
        daysToAdd += 7;
    }
    if (currentDayOfWeek === 0) {
        daysToAdd += 1; 
    }
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + daysToAdd);
    return nextDate.toISOString().split('T')[0];
}

export { 
    checkDoctorAvailability
};
