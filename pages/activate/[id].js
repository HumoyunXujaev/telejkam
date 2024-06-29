import { User } from '@/models/User';
import db from '@/utils/db';

const activateEmail = () => {
  return (
    <div>
      <h1>Your email was successfully activated</h1>
    </div>
  );
};

export default activateEmail;

export async function getServerSideProps(context) {
  await db.connectDb();
  //   find user by email
  const user = await User.findOne({
    email: context.params.email || context.query.email,
  });

  if (user) {
    user.emailVerified = true;
    await user.save();

    // redirect to profile page
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  await db.disConnectDb();

  return {
    props: {}, // will be passed to the page component as props
  };
}
