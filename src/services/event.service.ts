export const KEY_STORAGE_IPADDR = 'ipAddr';

export const fetchMovies = async () => {
  try {
    const response = await fetch('http://localhost:3000/movies');
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const fetchRooms = async () => {
  try {
    const response = await fetch('http://localhost:3000/rooms');
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
};

export const fetchInfo = async () => {
  try {
    const response = await fetch('http://localhost:3000/info');
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
};

export const fetchReservations = async () => {
  try {
    const response = await fetch('http://localhost:3000/reservations');
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
};

export const saveInfo = async (infoData: any) => {
  try {
    const response = await fetch('http://localhost:3000/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: infoData })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving info:', error);
    return { error: 'No se pudo guardar la información' };
  }
};

export const saveReservation = async (reservationData: {
  movie: string;
  room: string;
  schedule: string;
  seats: string[];
  email: string;
}) => {
  try {
    const response = await fetch('http://localhost:3000/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving reservation:', error);
    return { error: 'No se pudo guardar la reserva' };
  }
};
