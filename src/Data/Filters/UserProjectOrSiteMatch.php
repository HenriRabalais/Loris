<?php
/**
 * This file provides an implementation of the UserProjectOrSiteMatch filter.
 *
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Henri Rabalais <henri.j.rabalais@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\Data\Filters;

/**
 * UserProjectOrSiteMatch filters out data for any resource which is not part of
 * one of the user's projects and not part of one the user's sites. For a
 * DataInstance to be compatible with the UserProjectOrSite Match filter, it
 * must implement a getProjectIDs or getProjectID method which returns an
 * integer (or array) of ProjectIDs that the data belongs to as well as a
 * getCenterIDs or getCenterID method which returns an integer (or array) of
 * CenterIDs that the data belongs to. The data will be filtered out unless the
 * User is a member of at least one project or site that the resource
 * DataInstance is a member of.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @subpackage Data
 * @author     Henri Rabalais <henri.j.rabalais@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class UserProjectOrSiteMatch implements \LORIS\Data\Filter
{
    /**
     * Implements the \LORIS\Data\Filter interface
     *
     * @param \User                    $user     The user that the data is being
     *                                           filtered for.
     * @param \LORIS\Data\DataInstance $resource The data being filtered.
     *
     * @return bool true if the user has a project or site in common with the
     *              data
     */
    public function filter(\User $user, \Loris\Data\DataInstance $resource) : bool
    {
        $siteMatch    = (new \LORIS\Data\Filters\UserSiteMatch())
          ->filter($user, $resource);
        $projectMatch = (new \LORIS\Data\Filters\UserProjectMatch())
          ->filter($user, $resource);

        return $siteMatch || $projectMatch;
    }
}
