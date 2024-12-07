export interface Contact {
  _id: string;
  bouncer: string;
  email: string;
  partyDate: string;
  partyZipCode: string;
  phone?: string;
  tablesChairs?: boolean;
  generator?: boolean;
  popcornMachine?: boolean;
  cottonCandyMachine?: boolean;
  snowConeMachine?: boolean;
  pettingZoo?: boolean;
  ponyRides?: boolean;
  dj?: boolean;
  overnight?: boolean;
  message?: string;
  sourcePage: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
}
