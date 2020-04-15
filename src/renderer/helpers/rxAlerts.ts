import { BehaviorSubject, empty, ObservableInput } from 'rxjs';
import { rxUser } from './rxUser';
import { filter, switchMap, map, tap } from 'rxjs/operators';
import { firestore } from './firebase';
import { collectionData } from 'rxfire/firestore';
import { IAlert } from '..';
import { Alert } from './db/db';

/**
 * @description rxAlerts is the behavior subject for getting the layout of all alerts
 * @note this pulls directly from firebase and not local database as it doesn't update very much therefore, should not need to be hindered by using local db like users
 */
export const rxAlerts = rxUser.pipe(
  filter(x => !!x),
  switchMap(
    (authUser): ObservableInput<IAlert[]> => {
      if (!authUser) {
        return empty();
      }
      const ref = firestore
        .collection('users')
        .doc(authUser.uid)
        .collection('alerts');

      return collectionData(ref);
    }
  ),
  map((alerts: IAlert[]) =>
    alerts.map(
      (alert): Alert => {
        let newAlert = new Alert(
          alert.name,
          alert.name,
          alert.permissions || [],
          alert.reply,
          alert.cost || 0,
          alert.enabled,
          alert.sound,
          alert.image,
          alert.duration
        );
        if (newAlert.name.includes(' ')) {
          newAlert.delete();
          newAlert = new Alert(
            alert.name.replace(' ', '-'),
            alert.name.replace(' ', '-'),
            alert.permissions || [],
            alert.reply,
            alert.cost || 0,
            alert.enabled,
            alert.sound,
            alert.image,
            alert.duration
          );
          newAlert.save();
        }

        return newAlert;
      }
    )
  )
);
