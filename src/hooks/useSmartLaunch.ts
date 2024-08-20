import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSmartLaunch = () => {
  const [authEndpoint, setAuthEndpoint] = useState('');
  const [tokenEndpoint, setTokenEndpoint] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const iss = urlParams.get('iss');
    const launch = urlParams.get('launch');

    if (iss && launch) {
      localStorage.setItem('issuer', iss);
      fetchSmartConfiguration(iss, launch);
    } else {
      setError('Missing iss or launch parameters');
    }
  }, []);

  const fetchSmartConfiguration = async (iss: string, launch: string) => {
    try {
      const response = await axios.get(`${iss}/.well-known/smart-configuration`);
      setAuthEndpoint(response.data.authorization_endpoint);
      localStorage.setItem('authEndpoint', response.data.authorization_endpoint);
      localStorage.setItem('tokenEndpoint', response.data.token_endpoint);
      setTokenEndpoint(response.data.token_endpoint);
      initiateAuth(response.data.authorization_endpoint, iss, launch);
    } catch (error) {
      setError('Failed to fetch SMART configuration');
    }
  };

  const initiateAuth = (authUrl: string, iss: string, launch: string) => {
    const clientId = '91360c07-2b70-422b-bf6e-62cbd402f145';
    const redirectUri = `${window.location.origin}/callback`;
    const scope = 'openid fhirUser launch offline_access user/DocumentReference.read user/DocumentReference.write user/Encounter.read user/Encounter.write user/Observation.read user/Observation.write user/Patient.read user/Patient.write user/Person.read patient/Condition.read patient/Condition.write patient/Encounter.read patient/Encounter.write patient/Immunization.read patient/Immunization.write patient/Observation.read patient/Observation.write patient/Patient.read patient/Patient.write patient/Procedure.read patient/Procedure.write';
    const state = generateRandomState();

    // Store the state in sessionStorage
    sessionStorage.setItem('authState', state);

    const authorizationUrl = `${authUrl}?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}&` +
      `aud=${encodeURIComponent(iss)}&`+
      `launch=${launch}`;

    window.location.href = authorizationUrl;
  };

  const generateRandomState = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  return { authEndpoint, tokenEndpoint, error };
};
