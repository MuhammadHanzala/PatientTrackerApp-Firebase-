import fb from '../../firebase';
import { patients } from '../actions/actions';

export function createEntry(details, doctorId, navigate) {
    return async dispatch => {
        let date = new Date(details.date);
        let formattedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        let uniqueKey = fb.database().ref(`/entries/${doctorId}`).push().key;
        details["date"] = formattedDate;
        details["key"] = uniqueKey;
        await fb.database().ref(`/entries/${doctorId}/${uniqueKey}`).set(details)
            .then(() => {
                dispatch(getAllEntries(doctorId));
                navigate('HomePage');
            }).catch((error) => {
                console.log(error);
            })
    }
}
export function getAllEntries(doctorId) {
    return async dispatch => {
        try {
            await fb.database().ref(`/entries/${doctorId}`).once('value', (snap) => {
                let data = snap.val();
                    let arrayOfData = [];
                    for (var prop in data) {
                        arrayOfData.push(data[prop]);
                    }
                    dispatch(patients(arrayOfData));
                    console.log(arrayOfData);
                
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export function updateEntry(newDetails, doctorId, callback) {
    return dispatch => {
            new Promise((resolve, reject) => {
                let date = new Date(newDetails.date);
                let formattedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
                newDetails["date"] = formattedDate;
                fb.database().ref(`/entries/${doctorId}/${newDetails.key}`).update(newDetails)
                resolve();
            }).then(() => {
                callback();
            })


    }
}
export function deleteEntry(entry, doctorId, callback) {
    return dispatch => {
            new Promise((resolve, reject) => {
                fb.database().ref(`/entries/${doctorId}/${entry.key}`).remove()
                resolve();
            }).then(() => {
                callback();
            })
    }
}


