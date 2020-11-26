import pg from 'pg';

const { Client } = pg;

// set the way we will connect to the server
const pgConnectionConfigs = {
  user: process.env.USER,
  host: 'localhost',
  database: 'museum',

  port: 5432, // Postgres server always runs on this port
};

// create the var we'll use
const client = new Client(pgConnectionConfigs);

// make the connection to the server
client.connect();

const getArtistsByCollectionName = () => {
  const collectionName = process.argv[3];
  const selectArtistsIDQuery = `SELECT DISTINCT paintings.artist_id FROM collections INNER JOIN paintings ON collections.id = paintings.collection_id WHERE collections.name = '${collectionName}'`;
  console.log(selectArtistsIDQuery);
  client.query(selectArtistsIDQuery, (selectError, selectResult) => {
    if (selectError)
    {
      console.log(selectError);
      return;
    }
    console.log(selectResult.rows);
    const artistIds = selectResult.rows;
    artistIds.forEach((row, index) => {
      const selectArtistsNameQuery = `SELECT name FROM artists WHERE id = ${row.artist_id}`;
      client.query(selectArtistsNameQuery, (selectNameError, selectNameResult) => {
        if (selectNameError)
        {
          console.log(selectNameError);
          return;
        }
        console.log((index + 1), '. ', selectNameResult.rows[0].name);
        if (index === (artistIds.length - 1))
        {
          // close the connection
          client.end();
        }
      });
    });
  });
};

const createNewPainting = () => {
  const [paintingName, artistIDorName, collectionIDorName] = [...process.argv.splice(3)];
  if (isNaN(Number(artistIDorName)))
  {
    // Names are given.
    const selectCollectionIdQuery = `SELECT collections.id FROM collections  WHERE  name = '${collectionIDorName}'`;
    client.query(selectCollectionIdQuery, (collectionError, collectionResult) => {
      if (collectionError)
      {
        console.log(collectionError);
        return;
      }
      const collectionID = collectionResult.rows[0].id;
      console.log('collectionID: ', collectionID);
      const selectArtistIDQuery = `SELECT artists.id FROM artists WHERE name = '${artistIDorName}'`;
      client.query(selectArtistIDQuery, (artistError, artistsResult) => {
        if (artistError)
        {
          console.log(artistError);
          return;
        }
        const artistID = artistsResult.rows[0].id;
        console.log('artistID: ', artistID);
        const insertPaintingQuery = `INSERT INTO paintings (name, artist_id, collection_id) VALUES ('${paintingName}', ${artistID}, ${collectionID}) RETURNING *`;
        client.query(insertPaintingQuery, (insertError, insertResult) => {
          if (insertError)
          {
            console.log(insertError);
            return;
          }
          console.log('Inserted painting successfully', insertResult.rows);
          client.end();
        });
      });
    });
    return;
  }
  const insertPaintingQuery = `INSERT INTO paintings (name, artist_id, collection_id) VALUES ('${paintingName}', ${artistIDorName}, ${collectionIDorName}) RETURNING *`;
  client.query(insertPaintingQuery, (insertError, insertResult) => {
    if (insertError)
    {
      console.log(insertError);
      return;
    }
    console.log('Inserted painting successfully', insertResult.rows);
    client.end();
  });
};

const createNewCollections = () => {
  const [node, file, inputCmd, collectionName, ...paintingIds] = process.argv;
  const insertCollectionQuery = `INSERT INTO collections (name) VALUES ('${collectionName}') RETURNING id`;
  client.query(insertCollectionQuery, (insertError, insertResult) => {
    if (insertError)
    {
      console.log(insertError);
      return;
    }
    const newCollectionID = insertResult.rows[0].id;
    /**
     * UPDATE cats SET name='Susan Chan' WHERE id=2;
     */
    paintingIds.forEach((paintingID, index) => {
      const updateQuery = `UPDATE paintings SET collection_id = ${newCollectionID} WHERE id = ${paintingID} RETURNING *`;
      client.query(updateQuery, (updateError, updateResult) => {
        if (updateError)
        {
          console.log(updateError);
          return;
        }
        console.log('Updated collection id successfully', updateResult.rows);
        if ((index + 1) === paintingIds.length)
        {
          client.end();
        }
      });
    });
  });
};

const inputCommand = process.argv[2];
if (inputCommand === 'get-artists')
{
  getArtistsByCollectionName();
}
else if (inputCommand === 'new-painting')
{
  createNewPainting();
}
else if (inputCommand === 'new-collection')
{
  createNewCollections();
}
