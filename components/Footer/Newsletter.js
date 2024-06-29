import Link from 'next/link';
import { useState } from 'react';

import styled from './styles.module.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { MoonLoader } from 'react-spinners';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const subcribeHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('/api/newsletter', { email });
      setEmail('');
      setLoading(false);
      toast.success(data.message);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className={styled.footer__newsletter}>
      <h3>Подпишитесь на наши новости</h3>
      <div className={styled.footer__inputWrapper}>
        <input
          type='text'
          placeholder='Your Email Address'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <button
          className={styled.btn__primary}
          disabled={loading === true}
          style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          onClick={subcribeHandler}
          type='submit'
        >
          {loading ? (
            <>
              Waiting...
              <MoonLoader size={20} color='#fff' />
            </>
          ) : (
            'SUBSCRIBE'
          )}
        </button>
      </div>
      <p>
        Нажимая на кнопку подписаться, вы соглашаетесь с{' '}
        <Link href=''>нашими cookie & privacy/policy</Link>
      </p>
    </div>
  );
};

export default Newsletter;
