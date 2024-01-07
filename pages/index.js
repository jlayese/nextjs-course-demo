import { Fragment } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "@/components/meetups/MeetupList";

// import { useEffect, useState } from "react";

// const DUMMY_MEETUPS = [
//   {
//     id: 'm1',
//     title: 'A First meetup',
//     image: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg',
//     address: 'Some address 5, 12345 Some City',
//     description: 'This is a first meetup!'
//   },
//   {
//     id: 'm2',
//     title: 'A Cebu Meetup',
//     image: 'https://upload.wikimedia.org/wikipedia/commons/2/28/SINULOG_FESTIVAL_NOVENA_MASS.jpg',
//     address: 'Some address 5, 12345 Some City',
//     description: 'This is a first meetup!'
//   }
// ]

function HomePage(props) {

  // no need to use state management since we are using getStaticProps which is pre rendered
  // const [loadedMeetups, setLoadedMeetups] = useState([]);

  // useEffect(() => {
  //   // send a http request and fetch data
  //   setLoadedMeetups(DUMMY_MEETUPS)
  // }, []);

  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  )
}

// // any code you write here will always run on the server an not on the client
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   // fetch data from an API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   }
// }

// executed by the server
export async function getStaticProps() {
  // fetch data from an API

  // here we did it directly since our data is on the same app, also to avoid extra call
  // this code only executes on the server side
  const client = await MongoClient.connect('mongodb+srv://dazaizaoldyck:zmgn7GQU0vwG5ImF@cluster0.4iibv2q.mongodb.net/?retryWrites=true&w=majority')

  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close()

  return {
    props: {
      meetups: meetups.map(meetup => ({
        id: meetup._id.toString(),
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        description: meetup.description
      }))
    },
    revalidate: 1 // number of seconds NextJS will wait or regenerate after only when in this page
  };
}

export default HomePage;