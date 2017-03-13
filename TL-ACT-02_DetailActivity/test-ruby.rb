require "selenium-webdriver"

class Test
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)

    wait.until { @driver.find_element(:css => '#activity-list').displayed? }

    url = @testCase['testCases']['target'];
    sanitizedUrl = url.gsub("http://todo.app/activity/","")
    id = sanitizedUrl.split("/").first

    activities = @driver.find_elements :css => "#activity-#{id} h4 a"
    if activities.empty?
      activities = @driver.find_elements :css => "#activity-list li:first-child h4 a"
      puts activities[0].displayed?
      @driver.execute_script("arguments[0].setAttribute('data-target','#{url}')" , activities[0])
    end
    activities[0].click

    wait.until { @driver.find_element(:css => '.sub-activity .sut-list li, #registration-form').displayed? }

    respons = @driver.find_elements :css => ".sub-activity .sut-list li"
    if(!respons.empty?)
      return true
    end
    respons = @driver.find_elements :css => ".uk-alert.uk-alert-danger p"

    result = Array.new

    respons.each do |respon|
      result.push respon.text
    end

    expect = @testCase['messages']

    puts expect
    puts "///"
    puts result

    return Set.new(expect) === Set.new(result)
  end
end
