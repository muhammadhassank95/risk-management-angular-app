import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { HubConnectionState } from '@microsoft/signalr/dist/esm/HubConnection';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { debounce, fromEvent, merge, Observable, Subject, Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';

import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root'
})
export class RealTimeService {

  private token: string;
  private hubConnection: HubConnection;
  private baseUrl: string = environment.API.ENDPOINT;
  private idle$: Observable<any>;
  private debouncedIdleSubscription: any;
  private timer$: Subscription;
  private timeOutMilliSeconds: number;
  private idleSubscription: Subscription;
  private expired$: Subject<boolean> = new Subject<boolean>();

  constructor(
      // private storageService: StorageService
  ) { }

  public startWatching(timeOutSeconds: any): Observable<any> 
  {
      this.Connect();

      this.idle$ = merge(
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'click'),
        fromEvent(document, 'mousedown'),
        fromEvent(document, 'keypress'),
        fromEvent(document, 'DOMMouseScroll'),
        fromEvent(document, 'mousewheel'),
        fromEvent(document, 'touchmove'),
        fromEvent(document, 'MSPointerMove'),
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'resize'),
      );
  
      this.timeOutMilliSeconds = timeOutSeconds * 1000;
  
      this.idleSubscription = this.idle$.subscribe((res) => 
      {
          this.resetTimer();
      });

      this.debouncedIdleSubscription = this.idle$.pipe(debounce(() => timer(1000))).subscribe((res) => 
      {
          if (this.hubConnection && this.hubConnection.state === HubConnectionState.Connected)
          {
              console.log('Activity push', true);
              this.hubConnection.invoke('NewActivity', true);
          }
      });

      this.startTimer();
  
      return this.expired$;
  }
  private startTimer() 
  {
      this.timer$ = timer(this.timeOutMilliSeconds, this.timeOutMilliSeconds).subscribe((res) => 
      {
          this.expired$.next(true);
      });
  }
  
  public resetTimer() 
  {
      this.timer$.unsubscribe();
      this.startTimer();
  }
  
  public stopTimer() 
  {
      this.timer$.unsubscribe();
      this.idleSubscription.unsubscribe();
      this.debouncedIdleSubscription.unsubscribe();
  }

  private Connect() {
    this.InitilizeConnection(); // Initilizing real-time connection
      // this.storageService.accountToken.subscribe((token: any) => { // Getting account token
      //     if (token) {
      //         this.token = token;
      //     } else {
      //         this.Disconnect()
      //     }
      // });
  }

  private InitilizeConnection() {
      this.hubConnection = new HubConnectionBuilder().withUrl(this.baseUrl + '/UserActivityHub', { accessTokenFactory: () => this.token }).configureLogging(signalR.LogLevel.None).build();
      this.hubConnection.keepAliveIntervalInMilliseconds = 3000;
      this.hubConnection.serverTimeoutInMilliseconds = 30000;

      this.hubConnection.start().then(() => {
          console.log('Activity real-time connection started');
      }).catch(error => {
          console.log('Error while establishing real-time connection');
          this.AttemptRepeatedly();
      });

      this.hubConnection.onclose(() => {
          this.AttemptRepeatedly();
      });

      this.hubConnection.on('NewActivity', (activityPayload: boolean) => {
          console.log('Activity received', activityPayload);
          if (activityPayload === true)
          {
              this.resetTimer(); 
          }
      });

  }

  private AttemptRepeatedly() {
      // this.hubConnection = null;
      console.log('Activity real-time connection ended. Reconnecting in 3 minutes.');
      setTimeout(() => {
          this.InitilizeConnection();
      }, 180000);
  }

  private Disconnect() {
      if (this.hubConnection) {
          this.hubConnection.stop();
          // this.hubConnection = null;
      }
  }

}
