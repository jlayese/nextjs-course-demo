import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head';
import MeetupDetail from '@/components/meetups/MeetupDetail';
// import { useRouter } from 'next/router'; // can only be used in component 

function MeetupDetails(props) {

  return (
    // <MeetupDetail
    //   image="https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg"
    //   title="A First Meetup"
    //   address="Some Street 5, Some City"
    //   description="The meetup description"
    // />
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta
          name="description"
          content={props.meetupData.description}
        />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  )
}


// will not end up in the client
export async function getStaticPaths() {
  const client = await MongoClient.connect('mongodb+srv://dazaizaoldyck:zmgn7GQU0vwG5ImF@cluster0.4iibv2q.mongodb.net/?retryWrites=true&w=majority')

  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map(meetup => ({
      params: { meetupId: meetup._id.toString() }
    }))
    // [
    //   {
    //     params: {
    //       meetupId: 'm1'
    //     }
    //   },
    //   {
    //     params: {
    //       meetupId: 'm2'
    //     }
    //   }
    // ]
  }
}

export async function getStaticProps(context) {
  // fetch data for a single meetup

  const meetupId = context.params.meetupId;
  console.log(meetupId);
  const client = await MongoClient.connect('mongodb+srv://dazaizaoldyck:zmgn7GQU0vwG5ImF@cluster0.4iibv2q.mongodb.net/?retryWrites=true&w=majority')

  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({ _id: new ObjectId(meetupId) })

  console.log(selectedMeetup)

  client.close();

  // the props used in MeetupDetails component
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description
      }
    }
  }
}


export default MeetupDetails;