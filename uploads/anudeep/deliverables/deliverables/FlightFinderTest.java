package edu.upenn.cis573.flights;

import static org.junit.Assert.*;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import edu.upenn.cis573.flights.FlightFinder;

public class FlightFinderTest {

	// field to use in the various tests
	FlightFinder ff;

	@Before
	public void setUp() throws Exception {
		// initialize a new FlightFinder object before EVERY test
		ff = new FlightFinder();
	}

	@Test
	public void testNumFlightsDirect() {

		// test a direct flight that should exist
		// based on what's in Flight.allFlights

		// note that, if "direct" is true, then "timeLimit" should not be used
		int actual = ff.numFlights("PHL", "BOS", true, 0);

		int expected = 1;
		assertEquals("Return value from numFlights incorrect when finding direct flights", expected, actual);

		// don't forget to check the side effects!!
		List<Flight> direct = ff.getDirectFlights();
		assertEquals("Size of directFlights incorrect when finding direct flights", 1, direct.size()); // check
																										// number
																										// of
																										// elements
																										// in
																										// list

		Flight f = direct.get(0);
		assertEquals("Starting airport incorrect in first element when finding direct flights", "PHL", f.getStart());
		assertEquals("Ending airport incorrect in first element when finding direct flights", "BOS", f.getEnd());

		// check that there are no indirect flights reported
		List<Flight[]> indirect = ff.getIndirectFlights();
		assertEquals("Size of indirectFlights incorrect when finding direct flights", 0, indirect.size());

	}

	@Test
	public void testNumFlightsNoDirect() {

		// test a direct flight doesn't exist
		// based on what's in Flight.allFlights

		// note that, if "direct" is true, then "timeLimit" should not be used
		int actual = ff.numFlights("PHL", "SEA", true, 0);

		int expected = 0;
		assertEquals("Return value from numFlights incorrect when finding direct flights when there are actually none",
				expected, actual);

		List<Flight> direct = ff.getDirectFlights();
		assertEquals("Size of directFlights incorrect when finding direct flights", 0, direct.size()); // check
																										// number
																										// of
																										// elements
																										// in
																										// list

		// check that there are no indirect flights reported
		List<Flight[]> indirect = ff.getIndirectFlights();
		assertEquals("Size of indirectFlights incorrect when finding direct flights", 0, indirect.size());

	}

	@Test
	public void testNumFlightsInDirect() {

		// test a indirect flight that should exist
		// based on what's in Flight.allFlights

		// note that, if "indirect" is true, then "timeLimit" should be used
		/**
		 * Assuming that there can be at most 1 intermediate point in indirect
		 * flights
		 */
		int actual = ff.numFlights("PHL", "SFO", false, 10000);

		int expected = 2;
		assertEquals("Return value from numFlights incorrect when finding indirect flights", expected, actual);

		List<Flight[]> indirect = ff.getIndirectFlights();
		assertEquals("Starting airport incorrect in first element when finding indirect flights", "PHL",
				indirect.get(0)[0].getStart());
		assertEquals("Ending airport incorrect in first element when finding indirect flights", "SFO",
				indirect.get(0)[1].getEnd());
		assertEquals("Starting airport incorrect in first element when finding indirect flights", "PHL",
				indirect.get(0)[0].getStart());
		assertEquals("Ending airport incorrect in first element when finding indirect flights", "SFO",
				indirect.get(0)[1].getEnd());

		// check that there are is a indirect flight
		assertEquals("Size of indirectFlights incorrect when finding indirect flights", 2, indirect.size());

	}

	@Test
	public void testNumFlightsNoInDirect() {

		// test a indirect flight that doesn't exist
		// based on what's in Flight.allFlights

		// timelimit insufficient for indirect flight
		int actual = ff.numFlights("PHL", "SFO", false, 10);

		int expected = 0;
		assertEquals(
				"Return value from numFlights incorrect when finding indirect flights when there are actually none",
				expected, actual);

		List<Flight[]> indirect = ff.getIndirectFlights();
		// check that there are is no indirect flight
		assertEquals("Size of indirectFlights incorrect when finding indirect flights", 0, indirect.size());
	}

	@Test
	public void testNumFlightsDirectNoInDirect() {
		// test a direct flight that should exist but no indirect flights
		// based on what's in Flight.allFlights

		// direct flight exists but no indirect flight matching the time flight
		int actual = ff.numFlights("PHL", "BOS", false, 0);

		// only one direct flight
		int expected = 1;
		assertEquals("Return value from numFlights incorrect when finding indirect flights", expected,
				actual);

		// don't forget to check the side effects!!
		List<Flight> direct = ff.getDirectFlights();
		assertEquals("Size of directFlights incorrect when finding indirect flights", 1, direct.size()); // check
																										// number
																										// of
																										// elements
																										// in
																										// list

		Flight f = direct.get(0);
		assertEquals("Starting airport incorrect in first element when finding direct flights", "PHL", f.getStart());
		assertEquals("Ending airport incorrect in first element when finding direct flights", "BOS", f.getEnd());

		// check that there are no indirect flights reported
		List<Flight[]> indirect = ff.getIndirectFlights();
		assertEquals("Size of indirectFlights incorrect when finding indirect flights", 0, indirect.size());
	}

	@Test
	public void testNumFlightsInDirectNoDirect() {
		// test a direct flight that doesn't exist but there are indirect flights
		// based on what's in Flight.allFlights

		int actual = ff.numFlights("PHL", "SFO", false, 10000);

		// only one direct flight
		int expected = 2;
		assertEquals("Return value from numFlights incorrect when finding indirect flights", expected,
				actual);

		// don't forget to check the side effects!!
		List<Flight> direct = ff.getDirectFlights();
		assertEquals("Size of directFlights incorrect when finding indirect flights", 0, direct.size()); // check
																										// number
																										// of
																										// elements
																										// in
																										// list

		// check that there are 2 indirect flights reported
		List<Flight[]> indirect = ff.getIndirectFlights();
		assertEquals("Starting airport incorrect in first element when finding indirect flights", "PHL",
				indirect.get(0)[0].getStart());
		assertEquals("Ending airport incorrect in first element when finding indirect flights", "SFO",
				indirect.get(0)[1].getEnd());
		assertEquals("Starting airport incorrect in first element when finding indirect flights", "PHL",
				indirect.get(0)[0].getStart());
		assertEquals("Ending airport incorrect in first element when finding indirect flights", "SFO",
				indirect.get(0)[1].getEnd());

		// check that there are is a indirect flight
		assertEquals("Size of indirectFlights incorrect when finding indirect flights", 2, indirect.size());
	}

	@Test
	public void testNumFlightsDirectLowerCase() {

		// test a direct flight that should exist with lower case airport code
		// based on what's in Flight.allFlights

		// note that, if "direct" is true, then "timeLimit" should not be used
		int actual = ff.numFlights("phl", "bos", true, 0);

		int expected = 1;
		assertEquals("Return value from numFlights incorrect when finding direct flights", expected, actual);

		// don't forget to check the side effects!!
		List<Flight> direct = ff.getDirectFlights();
		assertEquals("Size of directFlights incorrect when finding direct flights", 1, direct.size()); // check
																										// number
																										// of
																										// elements
																										// in
																										// list

		Flight f = direct.get(0);
		assertEquals("Starting airport incorrect in first element when finding direct flights", "PHL",
				f.getStart().toUpperCase());
		assertEquals("Ending airport incorrect in first element when finding direct flights", "BOS",
				f.getEnd().toUpperCase());

		// check that there are no indirect flights reported
		List<Flight[]> indirect = ff.getIndirectFlights();
		assertEquals("Size of indirectFlights incorrect when finding direct flights", 0, indirect.size());

	}

	@Test
	public void testNumFlightsNoDirectLowerCase() {

		// test a direct flight doesn't exist with lower case airport code
		// based on what's in Flight.allFlights

		// note that, if "direct" is true, then "timeLimit" should not be used
		int actual = ff.numFlights("phl", "sea", true, 0);

		int expected = 0;
		assertEquals("Return value from numFlights incorrect when finding direct flights when there are actually none",
				expected, actual);

		List<Flight> direct = ff.getDirectFlights();
		assertEquals("Size of directFlights incorrect when finding direct flights", 0, direct.size()); // check
																										// number
																										// of
																										// elements
																										// in
																										// list

		// check that there are no indirect flights reported
		List<Flight[]> indirect = ff.getIndirectFlights();
		assertEquals("Size of indirectFlights incorrect when finding direct flights", 0, indirect.size());

	}

	@Test
	public void testNumFlightsInDirectLowerCase() {

		// test a indirect flight that should exist with lower case airport codes
		// based on what's in Flight.allFlights

		// note that, if "indirect" is true, then "timeLimit" should be used
		/**
		 * Assuming that there can be at most 1 intermediate point in indirect
		 */
		int actual = ff.numFlights("phl", "sfo", false, 10000);

		int expected = 2;
		assertEquals("Return value from numFlights incorrect when finding indirect flights", expected, actual);

		List<Flight[]> indirect = ff.getIndirectFlights();
		assertEquals("Starting airport incorrect in first element when finding indirect flights", "PHL",
				indirect.get(0)[0].getStart().toUpperCase());
		assertEquals("Ending airport incorrect in first element when finding indirect flights", "SFO",
				indirect.get(0)[1].getEnd().toUpperCase());
		assertEquals("Starting airport incorrect in first element when finding indirect flights", "PHL",
				indirect.get(0)[0].getStart().toUpperCase());
		assertEquals("Ending airport incorrect in first element when finding indirect flights", "SFO",
				indirect.get(0)[1].getEnd().toUpperCase());

		// check that there are is a indirect flight
		assertEquals("Size of indirectFlights incorrect when finding indirect flights", 2, indirect.size());

	}

	@Test
	public void testNumFlightsNoInDirectLowerCase() {

		// test a indirect flight that doesn't exist with lower case
		// based on what's in Flight.allFlights

		// timelimit insufficient for indirect flight
		int actual = ff.numFlights("phl", "bos", false, 0);

		int expected = 1;
		assertEquals("Return value from numFlights incorrect when finding indirect flights when there are actually none",
				expected, actual);

		List<Flight[]> indirect = ff.getIndirectFlights();
		// check that there are is no indirect flight
		assertEquals("Size of indirectFlights incorrect when finding indirect flights", 0, indirect.size());
	}

	@Test
	public void testValidSourceInvalidDest() {

		// note that, if "direct" is true, then "timeLimit" should not be used
		int actual = ff.numFlights("PHL", "aaa", true, 0);

		int expected = -1;
		assertEquals("Return value from numFlights incorrect when finding direct flights", expected, actual);

		// don't forget to check the side effects!!
		List<Flight> direct = ff.getDirectFlights();
		assertEquals("Size of directFlights incorrect when finding direct flights", 0, direct.size()); // check
																										// number
																										// of
																										// elements
																										// in
																										// list
		// check that there are no indirect flights reported
		List<Flight[]> indirect = ff.getIndirectFlights();
		assertEquals("Size of indirectFlights incorrect when finding direct flights", 0, indirect.size());

	}

	@Test
	public void testValidDestInvalidSource() {

		// note that, if "direct" is true, then "timeLimit" should not be used
		int actual = ff.numFlights("aaa", "PHL", true, 0);

		int expected = -1;
		assertEquals("Return value from numFlights incorrect when finding direct flights", expected, actual);

		// don't forget to check the side effects!!
		List<Flight> direct = ff.getDirectFlights();
		assertEquals("Size of directFlights incorrect when finding direct flights", 0, direct.size()); // check
																										// number
																										// of
																										// elements
																										// in
																										// list
		// check that there are no indirect flights reported
		List<Flight[]> indirect = ff.getIndirectFlights();
		assertEquals("Size of indirectFlights incorrect when finding direct flights", 0, indirect.size());

	}

	@Test
	public void testValidSourceNullDest() {

		// note that, if "direct" is true, then "timeLimit" should not be used
		int actual = ff.numFlights("PHL", null, true, 0);

		int expected = -1;
		assertEquals("Return value from numFlights incorrect when finding direct flights", expected, actual);

		// don't forget to check the side effects!!
		List<Flight> direct = ff.getDirectFlights();
		assertEquals("Size of directFlights incorrect when finding direct flights", 0, direct.size()); // check
																										// number
																										// of
																										// elements
																										// in
																										// list
		// check that there are no indirect flights reported
		List<Flight[]> indirect = ff.getIndirectFlights();
		assertEquals("Size of indirectFlights incorrect when finding direct flights", 0, indirect.size());

	}

	@Test
	public void testValidDestNullSource() {

		// note that, if "direct" is true, then "timeLimit" should not be used
		int actual = ff.numFlights(null, "SFO", true, 0);

		int expected = -1;
		assertEquals("Return value from numFlights incorrect when finding direct flights", expected, actual);

		// don't forget to check the side effects!!
		List<Flight> direct = ff.getDirectFlights();
		assertEquals("Size of directFlights incorrect when finding direct flights", 0, direct.size()); // check
																										// number
																										// of
																										// elements
																										// in
																										// list
		// check that there are no indirect flights reported
		List<Flight[]> indirect = ff.getIndirectFlights();
		assertEquals("Size of indirectFlights incorrect when finding direct flights", 0, indirect.size());

	}

	@Test
	public void testDirectNegativeTimeLimit() {

		// test a direct flight that should exist inspite of negative time limit
		// based on what's in Flight.allFlights

		// note that, if "direct" is true, then "timeLimit" should not be used
		int actual = ff.numFlights("PHL", "BOS", true, -10);

		int expected = 1;
		assertEquals("Return value from numFlights incorrect when finding direct flights", expected, actual);

		// don't forget to check the side effects!!
		List<Flight> direct = ff.getDirectFlights();
		assertEquals("Size of directFlights incorrect when finding direct flights", 1, direct.size()); // check
																										// number
																										// of
																										// elements
																										// in
																										// list

		Flight f = direct.get(0);
		assertEquals("Starting airport incorrect in first element when finding direct flights", "PHL", f.getStart());
		assertEquals("Ending airport incorrect in first element when finding direct flights", "BOS", f.getEnd());

		// check that there are no indirect flights reported
		List<Flight[]> indirect = ff.getIndirectFlights();
		assertEquals("Size of indirectFlights incorrect when finding direct flights", 0, indirect.size());

	}

	@Test
	public void testInDirectNegativeTimeLimit() {

		// test indirect flight with negative time limit
		// based on what's in Flight.allFlights

		// note that, if "direct" is true, then "timeLimit" should not be used
		int actual = ff.numFlights("PHL", "BOS", false, -10);

		int expected = -1;
		assertEquals("Return value from numFlights incorrect when finding indirect flights", expected, actual);

		// check that there are no indirect flights reported
		List<Flight[]> indirect = ff.getIndirectFlights();
		assertEquals("Size of indirectFlights incorrect when finding indirect flights", 0, indirect.size());

	}

	@Test
	public void testSameSourceSameDest() {

		// test a direct flight that shouldn't exist between same src and dest
		// based on what's in Flight.allFlights

		// note that, if "direct" is true, then "timeLimit" should not be used
		int actual = ff.numFlights("PHL", "PHL", true, 0);

		int expected = -1;
		assertEquals(
				"Return value from numFlights incorrect when finding direct flights from same source to same destination",
				expected, actual);

	}

}
