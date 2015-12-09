package edu.upenn.cis573.friends;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;

public class FriendFinder {
	
	/*
	 * This method takes a String representing the name of a student and then
	 * returns the name of another student who has the most friends in common.
	 * 
	 * There is no rule for tiebreaking if two or more other students have the 
	 * same number of friends in common.
	 * 
	 * If the argument to the method is null or is an empty String, 
	 * the method should return null. 
	 * 
	 * If the student named in the argument has no friends, 
	 * or their friends have no other friends, 
	 * then the method should return null in those cases, too. 
	 */
	public String suggestFriend(String me) {
		
		// some basic sanity checking
		if (me == null || me.length() == 0) return null;
		
		
		// DataSource ds = new FriendsDataSource();
		DataSource ds = factoryDataSource("Friend");
		
		List<String> myFriends = ds.get(me);
		if (myFriends == null) return null;
		
		// for each of my friends, find THEIR friends
		// and keep track of who has the most in common
		HashMap<String, Integer> count = new HashMap<String, Integer>();
		for (String friend : myFriends) {
			for (String name : ds.get(friend)) {
				if (name.equals(me) == false && myFriends.contains(name) == false) {
					if (count.containsKey(name)) {
						int score = count.get(name);
						score++;
						count.put(name, score);
					}
					else count.put(name, 0);
				}
			}
		}
		
		// now look through and see which friend-of-friend has the highest score
		int maxScore = -1;
		String suggestedFriend = null;
		for (String name : count.keySet()) {
			int score = count.get(name);
			if (score > maxScore) {
				suggestedFriend = name;
				maxScore = score;
			}
		}
		
		return suggestedFriend;
				
	}
	
	protected DataSource factoryDataSource(String arg) {
		if(arg.equals("Friend"))
			return new FriendsDataSource();
		if(arg.equals("Class"))
			return new ClassesDataSource();
		if(arg.equals("Student"))
			return new StudentsDataSource();
		return null;
	}

	/*
	 * This method takes a String representing the name of a student 
	 * and then returns a list containing the names of everyone else 
	 * who is taking the same classes as that student.
	 * The ordering of the elements in the list is non-deterministic. 
	 *  
	 * If the argument to the method is null or is empty, 
	 * the method should return null. 
	 * 
	 * If the student named in the argument is not taking any classes, 
	 * or if there are no other students taking the same classes, 
	 * the method should return null in those cases, too.  
	 */
	public List<String> findClassmates(String name) {
		
		if (name == null || name.length() == 0) return null;
		
		// DataSource cds = new ClassesDataSource();
		DataSource cds = factoryDataSource("Class");

		// find the classes that this student is taking
		List<String> myClasses = cds.get(name);
		if (myClasses == null) return null;
		
		// use the classes to find the names of the students
		//DataSource sds = new StudentsDataSource();
		DataSource sds = factoryDataSource("Student");
		
		List<String> classmates = new ArrayList<String>();
		
		for (String myClass : myClasses) {
			// list all the students in the class
			List<String> students = sds.get(myClass);

			for (String student : students) { 
				// find the other classes that they're taking
				List<String> theirClasses = cds.get(student);
			
				// see if all of the classes that they're taking are the same as the ones this student is taking
				boolean same = true;
				for (String c : myClasses) {
					if (theirClasses.contains(c) == false) {
						same = false;
						break;
					}
				}
				if (same) {
					if (student.equals(name) == false && classmates.contains(student) == false) 
						classmates.add(student);
				}
			}

		}
				
		if (classmates.isEmpty()) return null;
		else return classmates;
	}
	
	
}
