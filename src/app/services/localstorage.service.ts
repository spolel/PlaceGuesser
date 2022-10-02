import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  getHistory() {
    if (localStorage.getItem('history') != null) {
      return JSON.parse(localStorage.getItem('history'))
    } else {
      return { played: 0, highscore: 0, distribution: [] }
    }
  }

  setHistory(history: string) {
    localStorage.setItem("history", history)
  }

  getUserdata() {
    return JSON.parse(localStorage.getItem('userdata'))
  }

  setUserdata(userdata: string) {
    localStorage.setItem("userdata", userdata)
  }

  setUsername(username: string) {
    localStorage.setItem("userdata", JSON.stringify({ username: username }))
  }

  setGuest(guest: any) {
    localStorage.setItem("guest", JSON.stringify(guest))
  }

  getGuest() {
    return JSON.parse(localStorage.getItem('guest'))
  }
}
